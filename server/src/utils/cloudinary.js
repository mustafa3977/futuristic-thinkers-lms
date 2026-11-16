import { config } from '../config/env.js';

export const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

export const getMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  if (isCloudinaryConfigured()) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cleanPath = pathOrUrl.replace(/^\/+/, '');
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${cleanPath}`;
  }
  return pathOrUrl;
};
