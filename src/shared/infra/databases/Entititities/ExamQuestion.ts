import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

export type ExamQuestionType = 'open' | 'multiple_choice' | 'weighted';

export interface ExamOptionRaw {
  text: string;
  /** Para multiple_choice: true se for a resposta correta */
  isCorrect: boolean;
  /**
   * Para weighted: peso de acerto — valor decimal entre 0.0 e 1.0 (ex: 0.6, 0.75).
   * Para multiple_choice: 1.0 se isCorrect, 0.0 caso contrário.
   * Para open: não utilizado.
   */
  scoreWeight: number;
}

/**
 * Questão do banco de questões (MongoDB).
 * Compartilhada entre todos os módulos PROVA que referenciam o mesmo ExamBank.
 */
@Entity('exam_questions')
export class ExamQuestion {
  @ObjectIdColumn()
  _id!: ObjectId;

  /** Referência ao ExamBank (string do ObjectId) */
  @Column()
  bankId!: string;

  @Column()
  statement!: string;

  /**
   * open            → resposta textual livre
   * multiple_choice → mínimo 2 alternativas, 1 correta (scoreWeight 1.0/0.0)
   * weighted        → mínimo 2 alternativas com pesos decimais livres (0.0–1.0)
   */
  @Column()
  questionType!: ExamQuestionType;

  /** Eixo temático para agrupamento */
  @Column({ nullable: true })
  axis?: string;

  /** Alternativas (array embutido no documento) */
  @Column('array')
  options!: ExamOptionRaw[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
