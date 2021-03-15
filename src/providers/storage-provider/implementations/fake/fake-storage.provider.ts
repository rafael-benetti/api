import UploadFileResponseDto from '@providers/storage-provider/contracts/dtos/upload-file-response.dto';
import StorageProvider from '@providers/storage-provider/contracts/models/storage.provider';
import { v4 } from 'uuid';

class FakeStorageProvider implements StorageProvider {
  async uploadFile(file: unknown): Promise<UploadFileResponseDto> {
    return {
      key: v4(),
      downloadUrl: `https://cdn.skilljob.com/${file}`,
    };
  }

  async deleteFile(_: string): Promise<void> {
    return undefined;
  }
}

export default FakeStorageProvider;
