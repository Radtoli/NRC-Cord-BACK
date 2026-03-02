import path from 'path';
import fs from 'fs';
import { FileUploadRepository } from '../repositories/FileUploadRepository';
import { FileUpload } from '../entities/FileUpload';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint',   // .ppt
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export class UploadService {
  private uploadDir: string;

  constructor(private fileUploadRepository: FileUploadRepository) {
    this.uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(data: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    uploadedBy?: string;
  }): Promise<FileUpload> {
    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(data.mimeType)) {
      throw new Error(`File type not allowed: ${data.mimeType}`);
    }

    // Validate size
    if (data.sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new Error('File too large. Maximum size is 50MB');
    }

    // Generate unique filename
    const ext = path.extname(data.originalName);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Write to disk
    fs.writeFileSync(filePath, data.buffer);

    // Construct public URL
    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3001';
    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    // Persist record
    return this.fileUploadRepository.create({
      fileUrl,
      fileName,
      originalName: data.originalName,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      provider: 'local',
      uploadedBy: data.uploadedBy,
    });
  }

  async findById(id: string): Promise<FileUpload> {
    const file = await this.fileUploadRepository.findById(id);
    if (!file) throw new Error('File not found');
    return file;
  }
}
