import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './Course';
import { Page } from './Page';

export type ModuleType = 'CONTENT' | 'PROVA';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'course_id' })
  courseId!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * CONTENT = módulo normal com páginas e seções.
   * PROVA   = módulo de avaliação que exibe questões aleatórias do banco MongoDB.
   */
  @Column({ name: 'module_type', type: 'varchar', default: 'CONTENT' })
  moduleType!: ModuleType;

  /**
   * ID (string do ObjectId MongoDB) do banco de questões vinculado.
   * Preenchido somente quando moduleType === 'PROVA'.
   */
  @Column({ name: 'exam_bank_id', type: 'varchar', nullable: true })
  examBankId?: string;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Course, (course) => course.modules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @OneToMany(() => Page, (page) => page.module)
  pages!: Page[];
}
