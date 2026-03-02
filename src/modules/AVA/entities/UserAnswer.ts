import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './Quiz';
import { QuizQuestion } from './QuizQuestion';
import { QuizOption } from './QuizOption';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', length: 255 })
  userId!: string;

  @Column({ name: 'quiz_id' })
  quizId!: string;

  @Column({ name: 'question_id' })
  questionId!: string;

  @Column({ name: 'selected_option_id', nullable: true })
  selectedOptionId?: string;

  /** Para questões abertas */
  @Column({ name: 'open_answer', type: 'text', nullable: true })
  openAnswer?: string;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect!: boolean;

  /** Pontuação obtida nesta questão (0–100) */
  @Column({ name: 'score_obtained', type: 'decimal', precision: 5, scale: 2, default: 0 })
  scoreObtained!: number;

  @CreateDateColumn({ name: 'answered_at' })
  answeredAt!: Date;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz!: Quiz;

  @ManyToOne(() => QuizQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: QuizQuestion;

  @ManyToOne(() => QuizOption, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption?: QuizOption;
}
