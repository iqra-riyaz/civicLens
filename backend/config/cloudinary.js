import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary env vars missing. If UPLOAD_PROVIDER is cloudinary, uploads will fail.');
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export async function uploadToCloudinary(filePath, folder = 'civiclens') {
  return cloudinary.uploader.upload(filePath, { folder });
}


