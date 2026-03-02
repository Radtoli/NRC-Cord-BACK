import { DataSource, Repository } from 'typeorm';
import { FileUpload, FileProvider } from '../entities/FileUpload';

export class FileUploadRepository {
  private get repo(): Repository<FileUpload> {
    return this.postgresDataSource.getRepository(FileUpload);
  }

  constructor(private postgresDataSource: DataSource) {}

  async create(data: {
    fileUrl: string;
    fileName: string;
    originalName?: string;
    mimeType?: string;
    sizeBytes?: number;
    provider?: FileProvider;
    uploadedBy?: string;
  }): Promise<FileUpload> {
    const upload = this.repo.create(data);
    return this.repo.save(upload);
  }

  async findById(id: string): Promise<FileUpload | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByUploader(uploadedBy: string): Promise<FileUpload[]> {
    return this.repo.find({
      where: { uploadedBy },
      order: { createdAt: 'DESC' },
    });
  }
}
