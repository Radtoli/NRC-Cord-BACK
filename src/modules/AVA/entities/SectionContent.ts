import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Section } from './Section';

/**
 * Content shapes by section type:
 *
 * TEXT        → { html: string; markdown?: string }
 * VIDEO       → { url: string; title?: string }
 * FILE/SLIDES → { file_url: string; file_name: string; mime_type?: string; provider?: string }
 * STORYTELLING→ { file_url: string; file_name: string }
 * CASE_STUDY  → { text: string; attachments: Array<{ file_url: string; file_name: string }> }
 * QUIZ        → { quiz_id: string }
 * MINDMAP     → { file_url?: string; image_url?: string }
 * FINAL_MESSAGE→{ html: string; cta_label?: string; cta_url?: string }
 * DASHBOARD   → { metrics?: string[] }
 */
@Entity('section_contents')
export class SectionContent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'section_id' })
  sectionId!: string;

  @Column({ type: 'jsonb', default: '{}' })
  content!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToOne(() => Section, (section) => section.content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section!: Section;
}
