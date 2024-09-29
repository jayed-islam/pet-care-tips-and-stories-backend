/* eslint-disable no-console */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config';

import multer from 'multer';
import path from 'path';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendMultipleImagesToCloudinary = (
  imageNames: string[],
  paths: string[],
) => {
  return Promise.all(
    paths.map(
      (path, index) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            path,
            { public_id: imageNames[index].trim() },
            function (error, result) {
              if (error) {
                reject(error);
              }
              // delete a file asynchronously
              fs.unlink(path, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('File is deleted.');
                }
              });
              resolve(result);
            },
          );
        }),
    ),
  );
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), '/uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

export const upload = multer({ storage: storage });
