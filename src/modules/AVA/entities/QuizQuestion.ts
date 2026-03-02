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
import { Quiz } from './Quiz';
import { QuizOption } from './QuizOption';

export type QuestionType = 'open' | 'multiple_choice' | 'weighted';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'quiz_id' })
  quizId!: string;

  @Column({ type: 'text' })
  statement!: string;

  /**
   * Tipo da questão:
   *  open            → resposta aberta em texto
   *  multiple_choice → 4 alternativas, exatamente 1 correta
   *  weighted        → 5 alternativas com pesos 100/75/50/25/0
   */
  @Column({ name: 'question_type', type: 'varchar', default: 'multiple_choice' })
  questionType!: QuestionType;

  /** Eixo temático para agrupamento de resultado */
  @Column({ length: 255, nullable: true })
  axis?: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 1.0 })
  weight!: number;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz!: Quiz;

  @OneToMany(() => QuizOption, (opt) => opt.question)
  options!: QuizOption[];
}
