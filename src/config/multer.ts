import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const MAX_SIZE_TWO_MEGABYTES = 15 * 1024 * 1024;

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      const fileHash = crypto.randomBytes(16).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      cb(null, fileName);
    },
  }),

  S3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_NAME || '',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const filename = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, filename);
      });
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldname: file.fieldname });
    },
  }),
};

export default {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage:
    process.env.STORAGE_TYPE === 'S3' ? storageTypes.S3 : storageTypes.local,

  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,
  },
};
