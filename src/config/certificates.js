const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '../../cert');

const readCertFile = (filename) => {
  try {
    const filePath = path.join(certsPath, filename);
    if (fs.existsSync(filePath)) {
      // Read file as UTF-8 and clean up the content
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove any BOM and normalize line endings
      content = content
        .replace(/^\uFEFF/, '') // Remove BOM if present
        .replace(/\r\n/g, '\n') // Normalize line endings to LF
        .replace(/\r/g, '\n')    // Handle any remaining CRs
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      // Ensure the content has the proper begin/end markers
      if (!content.includes('-----BEGIN') || !content.includes('-----END')) {
        throw new Error(`El archivo ${filename} no parece ser un certificado/clave PEM válido`);
      }

      return content + '\n'; // Ensure trailing newline
    }
    console.warn(`⚠️ Archivo de certificado no encontrado: ${filePath}`);
    return null;
  } catch (error) {
    console.error(`❌ Error al leer el archivo ${filename}:`, error.message);
    console.error('Asegúrate de que el archivo existe y tiene el formato PEM correcto');
    return null;
  }
};

// Read all required certificates
const key = readCertFile('server.key');
const cert = readCertFile('server.crt');
const ca = readCertFile('ca.crt');

// Log certificate status
const hasAllCerts = key && cert && ca;
if (process.env.NODE_ENV !== 'production') {
  console.log('🔐 Estado de los certificados:');
  console.log(`- Clave privada: ${key ? '✅' : '❌ No encontrada'}`);
  console.log(`- Certificado: ${cert ? '✅' : '❌ No encontrado'}`);
  console.log(`- CA: ${ca ? '✅' : '❌ No encontrada'}`);
  
  if (!hasAllCerts) {
    console.warn('⚠️  Algunos certificados no se encontraron. Usando modo desarrollo sin HTTPS.');
  } else {
    console.log('✅ Todos los certificados están listos para producción');
  }
}

module.exports = {
  httpsOptions: {
    key: key,
    cert: cert,
    ca: ca,
    requestCert: false,
    rejectUnauthorized: process.env.NODE_ENV === 'production', // Solo verificar en producción
    minVersion: 'TLSv1.2',
    ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK'
  },
  hasValidCerts: hasAllCerts
};