import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { ExamOptionRaw, ExamQuestionType } from './ExamQuestion';

export interface AttemptQuestionSnapshot {
  questionId: string;
  statement: string;
  questionType: ExamQuestionType;
  axis?: string;
  options: Omit<ExamOptionRaw, 'isCorrect' | 'scoreWeight'>[];
}

export interface AttemptAnswer {
  questionId: string;
  /** Para open: texto livre. Para multiple_choice/weighted: índice (0-based) da opção escolhida */
  answer: string;
  /** Pontuação obtida nesta questão (0–100) */
  scoreObtained: number;
}

/**
 * Registro de uma tentativa de prova por um aluno.
 */
@Entity('exam_attempts')
export class ExamAttempt {
  @ObjectIdColumn()
  _id!: ObjectId;

  /** userId (string do ObjectId do User MongoDB) */
  @Column()
  userId!: string;

  /** moduleId (UUID PostgreSQL) do módulo PROVA */
  @Column()
  moduleId!: string;

  /** bankId (string do ObjectId do ExamBank) */
  @Column()
  bankId!: string;

  /** Snapshot das 10 questões sorteadas (sem gabarito) */
  @Column('array')
  questions!: AttemptQuestionSnapshot[];

  /** Respostas do aluno */
  @Column('array')
  answers!: AttemptAnswer[];

  /** Pontuação final (0–100) */
  @Column({ type: 'double', default: 0 })
  score!: number;

  /** Se atingiu nota mínima */
  @Column({ default: false })
  passed!: boolean;

  /** Se o aluno já finalizou */
  @Column({ default: false })
  completed!: boolean;

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ nullable: true })
  completedAt?: Date;
}
