import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from './Page';
import { SectionContent } from './SectionContent';

export type SectionType =
  | 'TEXT'
  | 'VIDEO'
  | 'FILE'
  | 'SLIDES'
  | 'STORYTELLING'
  | 'CASE_STUDY'
  | 'QUIZ'
  | 'MINDMAP'
  | 'FINAL_MESSAGE'
  | 'DASHBOARD'
  | 'EXAM_BANK';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'page_id' })
  pageId!: string;

  @Column({ type: 'varchar' })
  type!: SectionType;

  @Column({ length: 255 })
  title!: string;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex!: number;

  /**
   * config holds type-specific metadata, e.g.:
   *   VIDEO      → { provider: "vimeo", duration: 320 }
   *   QUIZ       → { quiz_id: "uuid" }
   *   FILE       → { mime_type: "application/pdf", provider: "s3" }
   */
  @Column({ type: 'jsonb', default: '{}' })
  config!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Page, (page) => page.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page!: Page;

  @OneToOne(() => SectionContent, (sc) => sc.section)
  content!: SectionContent;
}
