import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

/**
 * Banco de questões para provas.
 * Cada módulo do tipo PROVA referencia um ExamBank pelo _id (ObjectId).
 */
@Entity('exam_banks')
export class ExamBank {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  /** courseId (UUID PostgreSQL) para qual este banco pertence — opcional */
  @Column({ nullable: true })
  courseId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
