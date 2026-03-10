import { DataSource, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ExamBank } from '../../../shared/infra/databases/Entititities/ExamBank';
import { ExamQuestion } from '../../../shared/infra/databases/Entititities/ExamQuestion';
import { ExamAttempt } from '../../../shared/infra/databases/Entititities/ExamAttempt';

export class ExamRepository {
  private get bankRepo(): MongoRepository<ExamBank> {
    return this.mongoDataSource.getMongoRepository(ExamBank);
  }

  private get questionRepo(): MongoRepository<ExamQuestion> {
    return this.mongoDataSource.getMongoRepository(ExamQuestion);
  }

  private get attemptRepo(): MongoRepository<ExamAttempt> {
    return this.mongoDataSource.getMongoRepository(ExamAttempt);
  }

  constructor(private mongoDataSource: DataSource) { }

  // ── ExamBank ──────────────────────────────────────────

  async createBank(data: Partial<ExamBank>): Promise<ExamBank> {
    const bank = this.bankRepo.create(data);
    return this.bankRepo.save(bank);
  }

  async findBankById(id: string): Promise<ExamBank | null> {
    try {
      return this.bankRepo.findOne({ where: { _id: new ObjectId(id) } as any });
    } catch {
      return null;
    }
  }

  async findAllBanks(): Promise<ExamBank[]> {
    return this.bankRepo.find();
  }

  async updateBank(id: string, data: Partial<ExamBank>): Promise<ExamBank | null> {
    await this.bankRepo.updateOne({ _id: new ObjectId(id) }, { $set: data });
    return this.findBankById(id);
  }

  async deleteBank(id: string): Promise<void> {
    await this.bankRepo.deleteOne({ _id: new ObjectId(id) });
    // Remove all questions that belong to this bank
    await this.questionRepo.deleteMany({ bankId: id } as any);
  }

  // ── ExamQuestion ──────────────────────────────────────

  async createQuestion(data: Partial<ExamQuestion>): Promise<ExamQuestion> {
    const q = this.questionRepo.create(data);
    return this.questionRepo.save(q);
  }

  async findQuestionById(id: string): Promise<ExamQuestion | null> {
    try {
      return this.questionRepo.findOne({ where: { _id: new ObjectId(id) } as any });
    } catch {
      return null;
    }
  }

  async findQuestionsByBankId(bankId: string): Promise<ExamQuestion[]> {
    return this.questionRepo.find({ where: { bankId } as any });
  }

  async updateQuestion(id: string, data: Partial<ExamQuestion>): Promise<ExamQuestion | null> {
    await this.questionRepo.updateOne({ _id: new ObjectId(id) }, { $set: data });
    return this.findQuestionById(id);
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.questionRepo.deleteOne({ _id: new ObjectId(id) });
  }

  async countQuestions(bankId: string): Promise<number> {
    // Use countDocuments (raw MongoDB filter) instead of count({ where }) to avoid
    // TypeORM MongoRepository translation inconsistencies that can return 0 incorrectly.
    return this.questionRepo.countDocuments({ bankId });
  }

  /** Retorna `count` questões aleatórias do banco */
  async getRandomQuestions(bankId: string, count: number): Promise<ExamQuestion[]> {
    const questions = await this.questionRepo.find({ where: { bankId } as any });
    // Shuffle in-application (MongoDB Atlas free tier may not support $sample via aggregate)
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions.slice(0, count);
  }

  // ── ExamAttempt ───────────────────────────────────────

  async createAttempt(data: Partial<ExamAttempt>): Promise<ExamAttempt> {
    const attempt = this.attemptRepo.create(data);
    return this.attemptRepo.save(attempt);
  }

  async findAttemptById(id: string): Promise<ExamAttempt | null> {
    try {
      return this.attemptRepo.findOne({ where: { _id: new ObjectId(id) } as any });
    } catch {
      return null;
    }
  }

  async findAttemptsByUser(userId: string, moduleId?: string): Promise<ExamAttempt[]> {
    const where: any = { userId };
    if (moduleId) where.moduleId = moduleId;
    return this.attemptRepo.find({ where });
  }

  /** Retorna todos os attempts concluídos que têm questões abertas e ainda não foram corrigidos */
  async findPendingCorrections(): Promise<ExamAttempt[]> {
    // We filter in application layer since MongoDB TypeORM has limited query support
    const all = await this.attemptRepo.find({ where: { completed: true } as any });
    return all.filter((a) => {
      const hasOpenQuestion = a.questions.some((q) => q.questionType === 'open');
      return hasOpenQuestion && !a.correctorId;
    });
  }

  /** Retorna todos os attempts concluídos que têm questões abertas (corrigidos e pendentes) */
  async findAllCompletedWithOpenQuestions(): Promise<ExamAttempt[]> {
    const all = await this.attemptRepo.find({ where: { completed: true } as any });
    return all.filter((a) => a.questions.some((q) => q.questionType === 'open'));
  }

  async updateAttempt(id: string, data: Partial<ExamAttempt>): Promise<ExamAttempt | null> {
    await this.attemptRepo.updateOne({ _id: new ObjectId(id) }, { $set: data });
    return this.findAttemptById(id);
  }
}
