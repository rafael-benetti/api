import AWS from 'aws-sdk';

import { v4 } from 'uuid';
import awsConfig from '@config/aws';
import UploadFileResponseDto from '@providers/storage-provider/contracts/dtos/upload-file-response.dto';
import StorageProvider from '@providers/storage-provider/contracts/models/storage.provider';

class AwsStorageProvider implements StorageProvider {
  private s3 = new AWS.S3({
    endpoint: awsConfig.endpoint,
    accessKeyId: awsConfig.accessKey,
    secretAccessKey: awsConfig.secretKey,
  });

  async uploadFile(file: Express.Multer.File): Promise<UploadFileResponseDto> {
    const payload = {
      Body: file.buffer,
      Bucket: awsConfig.bucket,
      ACL: 'public-read',
      Key: v4(),
    };

    const response = await this.s3.upload(payload).promise();

    return {
      key: response.Key,
      downloadUrl: response.Location,
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: awsConfig.bucket as string,
        Key: key,
      })
      .promise();
  }
}

export default AwsStorageProvider;
