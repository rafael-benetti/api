import logger from '@config/logger';
import AWS, { S3 } from 'aws-sdk';
import { injectable } from 'tsyringe';

interface deleteObjectDTO {
  bucketName: string;
  key: string;
}

@injectable()
class S3Service {
  region: string;

  s3: S3;

  constructor() {
    this.region = process.env.AWS_REGION || '';
    AWS.config.update({ region: this.region });
    AWS.config.getCredentials(err => {
      if (err) logger.error(err);
      else {
        // logger.info('AWS credentials:', AWS.config.credentials);
      }
    });

    this.s3 = new S3();
  }

  deleteObject({
    bucketName,
    key,
  }: deleteObjectDTO): Promise<S3.DeleteObjectOutput> {
    const bucketParams = {
      Bucket: bucketName,
      Key: key,
    };

    return new Promise((resolve, _) => {
      this.s3.deleteObject(bucketParams, (err, data) => {
        if (err) logger.error(err);
        else {
          resolve(data);
        }
      });
    });
  }
}

export default S3Service;
