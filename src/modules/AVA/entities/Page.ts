import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Module } from './Module';
import { Section } from './Section';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'module_id' })
  moduleId!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 300, nullable: true })
  slug?: string;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex!: number;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished!: boolean;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Module, (module) => module.pages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module!: Module;

  @OneToMany(() => Section, (section) => section.page)
  sections!: Section[];
}
