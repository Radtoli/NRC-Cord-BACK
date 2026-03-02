import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizQuestion } from './QuizQuestion';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'randomize_questions', type: 'boolean', default: true })
  randomizeQuestions!: boolean;

  @Column({ name: 'questions_to_show', type: 'int', default: 10 })
  questionsToShow!: number;

  @Column({ name: 'passing_score', type: 'decimal', precision: 5, scale: 2, default: 60 })
  passingScore!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => QuizQuestion, (q) => q.quiz)
  questions!: QuizQuestion[];
}
