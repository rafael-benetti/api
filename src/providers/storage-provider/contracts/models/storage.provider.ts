import UploadFileResponseDto from '../dtos/upload-file-response.dto';

interface StorageProvider {
  uploadFile(file: unknown): Promise<UploadFileResponseDto>;
  deleteFile(key: string): Promise<void>;
}

export default StorageProvider;
