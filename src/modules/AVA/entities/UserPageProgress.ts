import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Page } from './Page';

@Entity('user_page_progress')
export class UserPageProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', length: 255 })
  userId!: string;

  @Column({ name: 'page_id' })
  pageId!: string;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @Column({ name: 'time_spent_seconds', type: 'int', default: 0 })
  timeSpentSeconds!: number;

  @Column({ name: 'last_access', type: 'timestamptz', default: () => 'NOW()' })
  lastAccess!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Page, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page!: Page;
}
