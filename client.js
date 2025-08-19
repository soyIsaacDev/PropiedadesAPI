const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Using HTTPS for secure connection with mutual TLS
const useHttps = true; // Set to true for HTTPS

const options = {
    hostname: 'localhost',
    port: 8080, // HTTPS port
    path: '/',
    method: 'GET',
    headers: {
        'Origin': 'https://localhost:3000', // Changed to HTTPS
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'content-type'
    },
    withCredentials: true
};

// Only add HTTPS options if using HTTPS
if (useHttps) {
    const certsPath = path.join(__dirname, 'cert');
    
    try {
        // Client certificate for mutual TLS
        options.key = fs.readFileSync(path.join(certsPath, 'client.key'));
        options.cert = fs.readFileSync(path.join(certsPath, 'client.crt'));
        
        // CA certificate to verify the server
        options.ca = fs.readFileSync(path.join(certsPath, 'ca.crt'));
        
        // For development, we'll accept self-signed certificates
        options.rejectUnauthorized = false; // Set to true in production
        
        // TLS version configuration
        options.minVersion = 'TLSv1.2';
        options.maxVersion = 'TLSv1.3';
        
        // For development, skip hostname verification
        options.checkServerIdentity = (host, cert) => {
            console.log('Connected to server with certificate from:', cert.subject?.O || 'Unknown');
            console.log('Certificate valid from:', cert.valid_from);
            console.log('Certificate valid to:', cert.valid_to);
            return undefined; // Skip hostname verification for development
        };
        
        // Add client certificate authentication headers
        options.agent = new https.Agent({
            key: options.key,
            cert: options.cert,
            ca: options.ca,
            rejectUnauthorized: false // Only for development
        });
        
        console.log('Using HTTPS with client certificate authentication');
    } catch (error) {
        console.error('Error loading certificates:', error.message);
        process.exit(1);
    }
} else {
    console.log('Using HTTP (insecure)');
}

console.log(`Starting ${useHttps ? 'HTTPS' : 'HTTP'} request to: http${useHttps ? 's' : ''}://${options.hostname}:${options.port}`);

console.log('Creating HTTPS request with options:', JSON.stringify(options, null, 2));

// Use either http or https based on our flag
const req = (useHttps ? https : http).request(options, (res) => {
    console.log('Response received');
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    
    let data = Buffer.alloc(0);
    
    res.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
    });
    
    res.on('end', () => {
        console.log('Response completed');
        if (data.length > 0) {
            try {
                const contentType = res.headers['content-type'] || '';
                if (contentType.includes('application/json')) {
                    console.log('Response Body (JSON):', JSON.parse(data.toString()));
                } else {
                    console.log('Response Body:', data.toString());
                }
            } catch (e) {
                console.log('Raw Response (hex):', data.toString('hex'));
            }
        } else {
            console.log('No response body');
        }
    });
});

req.on('socket', (socket) => {
    console.log('Socket created');
    
    socket.on('connect', () => {
        console.log('Socket connected');
    });
    
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
    
    socket.on('timeout', () => {
        console.error('Socket timeout');
    });
    
    socket.on('close', (hadError) => {
        console.log(`Socket closed ${hadError ? 'with error' : 'normally'}`);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    if (e.code === 'ECONNREFUSED') {
        console.error('Connection was refused. Is the server running?');
    } else if (e.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
        console.error('Self-signed certificate error. Try setting rejectUnauthorized to false for development.');
    } else {
        console.error('Error details:', e);
    }
});

// Set a timeout for the request
req.setTimeout(5000, () => {
    console.error('Request timeout');
    req.destroy();
});

req.end();