import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type FileProvider = 'local' | 's3' | 'drive' | 'onedrive' | 'external';

@Entity('file_uploads')
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'file_url', length: 1024 })
  fileUrl!: string;

  @Column({ name: 'file_name', length: 512 })
  fileName!: string;

  @Column({ name: 'original_name', length: 512, nullable: true })
  originalName?: string;

  @Column({ name: 'mime_type', length: 128, nullable: true })
  mimeType?: string;

  @Column({ name: 'size_bytes', type: 'int', nullable: true })
  sizeBytes?: number;

  @Column({ type: 'varchar', default: 'local' })
  provider!: FileProvider;

  @Column({ name: 'uploaded_by', length: 255, nullable: true })
  uploadedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
