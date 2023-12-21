'use strict';
const config = require('../../configCloudBucket');
// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');

// Create the storage client
// The Storage(...) factory function accepts an options
// object which is used to specify which project's Cloud
// Storage buckets should be used via the projectId
// property.
// The projectId is retrieved from the config module.
// This module retrieves the project ID from the
// GCLOUD_PROJECT environment variable.
const storage = new Storage({
  projectId: config.get('GCLOUD_PROJECT')
});

// Get the GCLOUD_BUCKET environment variable
// Recall that earlier you exported the bucket name into an
// environment variable.
// The config module provides access to this environment
// variable so you can use it in code
const GCLOUD_BUCKET = config.get('GCLOUD_BUCKET');

// Get a reference to the Cloud Storage bucket
const bucket = storage.bucket(GCLOUD_BUCKET);

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have a new property:
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START sendUploadToGCS]
function sendUploadToGCS(req, res, next) {
  // The existing code in the handler checks to see if there
  // is a file property on the HTTP request - if a file has
  // been uploaded, then Multer will have created this
  // property in the preceding middleware call.
  console.log("Send Upload To GCS")
  if (!req.file) {
    return next();
  }
  console.log("Archivos a subir " + JSON.stringify(req.file))
  // In addition, a unique object name, oname,  has been
  // created based on the file's original name. It has a
  // prefix generated using the current date and time.
  // This should ensure that a new file upload won't
  // overwrite an existing object in the bucket
  const oname = Date.now() + req.file.originalname;
  // Get a reference to the new object
  const file = bucket.file(oname);
  
  // Create a stream to write the file into
  // Cloud Storage
  // The uploaded file's MIME type can be retrieved using
  // req.file.mimetype.
  // Cloud Storage metadata can be used for many purposes,
  // including establishing the type of an object.
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });
  console.log("stream " + JSON.stringify(stream))
  // Attach two event handlers (1) error
  // Event handler if there's an error when uploading
  stream.on('error', err => {
    // If there's an error move to the next handler
    next(err);
    
  });
  
  // Attach two event handlers (2) finish
  // The upload completed successfully
  /* stream.on('finish', () => {
    // Make the object publicly accessible
    file.makePublic().then(() => {
      // Set a new property on the file for the
      // public URL for the object
  // Cloud Storage public URLs are in the form:
  // https://storage.googleapis.com/[BUCKET]/[OBJECT]
  // Use an ECMAScript template literal (`https://...`)to
  // populate the URL with appropriate values for the bucket
  // ${GCLOUD_BUCKET} and object name ${oname}
      req.file.cloudStoragePublicUrl = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${oname}`;
      
      // Invoke the next middleware handler
      next();
      
    });
    
  }); */
  
  // End the stream to upload the file's data
  stream.end(req.file.buffer);
  
}
// [END sendUploadToGCS]
// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 40 * 1024 * 1024 // no larger than 40mb
  }
});

// Custom file upload middleware
const uploadImages = (req, res, next) => {
  console.log("Upload Imagenes")
  // Use multer upload instance
  multer.array('imagenesfiles', 25)(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];
    /* req.files.map(file => {
      console.log("Mapping")
      console.log(file)
    }) */
    console.log(JSON.stringify(files));
    const data = req.body;
    //console.log("Image Data "+ JSON.stringify(data))
    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

// [END multer]
module.exports = {
  sendUploadToGCS,
  multer,
  uploadImages
};