import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizQuestion } from './QuizQuestion';

@Entity('quiz_options')
export class QuizOption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'question_id' })
  questionId!: string;

  @Column({ type: 'text' })
  text!: string;

  /** Para multiple_choice: true quando é a alternativa correta */
  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect!: boolean;

  /**
   * Para questões weighted: peso percentual desta alternativa (0 | 25 | 50 | 75 | 100).
   * Para multiple_choice: 100 se isCorrect, 0 caso contrário.
   */
  @Column({ name: 'score_weight', type: 'float', default: 0 })
  scoreWeight!: number;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => QuizQuestion, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: QuizQuestion;
}
