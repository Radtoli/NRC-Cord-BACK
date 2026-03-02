import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Module } from './Module';

export type CourseStatus = 'draft' | 'published' | 'archived';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'cover_image_url', length: 512, nullable: true })
  coverImageUrl?: string;

  @Column({ type: 'varchar', default: 'draft' })
  status!: CourseStatus;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ name: 'created_by', length: 255, nullable: true })
  createdBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Module, (module) => module.course)
  modules!: Module[];
}
