import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import cloudinary from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/media', authMiddleware.verifyToken, upload.array('files', 5), async (req, res) => {
  try {
    console.log('Upload route hit');
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        console.log('Uploading file:', file.originalname, file.mimetype);
        
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const uploadOptions = {
          folder: 'teamFlow/assets',
          resource_type: 'auto',
          public_id: `${file.originalname.replace(/\.[^/.]+$/, '')}-${uniqueId}`
        };
        
        const uploadStream = cloudinary.v2.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          } else {
            console.log('Upload success:', result.secure_url);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              type: result.resource_type === 'image' ? 'image' : 'file',
              originalName: file.originalname
            });
          }
        });
        
        uploadStream.end(file.buffer);
      });
    });

    const files = await Promise.all(uploadPromises);
    res.json({ files });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed: ' + error.message });
  }
});

export default router;