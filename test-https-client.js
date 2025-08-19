const https = require('https');
const { clientCertOptions } = require('./src/config/certificates');

const options = {
    hostname: 'localhost',
    port: process.env.PORT || 3000,
    path: '/',
    method: 'GET',
    ...clientCertOptions
};

console.log('Iniciando petición HTTPS con autenticación mutua...');
console.log(`Conectando a: https://${options.hostname}:${options.port}${options.path}`);

const req = https.request(options, (res) => {
    console.log('\n--- RESPUESTA DEL SERVIDOR ---');
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('\nCuerpo de la respuesta:');
        console.log(data);
    });
});

req.on('error', (e) => {
    console.error('\n--- ERROR EN LA PETICIÓN ---');
    console.error('Mensaje:', e.message);
    
    if (e.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        console.error('\nPosibles soluciones:');
        console.error('1. Asegúrate de que el servidor esté corriendo con HTTPS');
        console.error('2. Verifica que los certificados estén en la ubicación correcta');
        console.error('3. Comprueba que el certificado de la CA sea el mismo en cliente y servidor');
    }
});

// Manejar señales de terminación
process.on('SIGINT', () => {
    console.log('\nCliente terminado por el usuario');
    process.exit();
});

console.log('Enviando petición...');
req.end();
