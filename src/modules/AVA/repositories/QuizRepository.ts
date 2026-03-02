import { DataSource, Repository } from 'typeorm';
import { Quiz } from '../entities/Quiz';
import { QuizQuestion } from '../entities/QuizQuestion';
import { QuizOption } from '../entities/QuizOption';
import { UserAnswer } from '../entities/UserAnswer';

export class QuizRepository {
  private get quizRepo(): Repository<Quiz> {
    return this.postgresDataSource.getRepository(Quiz);
  }

  private get questionRepo(): Repository<QuizQuestion> {
    return this.postgresDataSource.getRepository(QuizQuestion);
  }

  private get optionRepo(): Repository<QuizOption> {
    return this.postgresDataSource.getRepository(QuizOption);
  }

  private get answerRepo(): Repository<UserAnswer> {
    return this.postgresDataSource.getRepository(UserAnswer);
  }

  constructor(private postgresDataSource: DataSource) {}

  // ── Quiz ───────────────────────────────────────────────
  async createQuiz(data: Partial<Quiz>): Promise<Quiz> {
    const quiz = this.quizRepo.create(data);
    return this.quizRepo.save(quiz);
  }

  async findQuizById(id: string): Promise<Quiz | null> {
    return this.quizRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });
  }

  async findAllQuizzes(): Promise<Quiz[]> {
    return this.quizRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz | null> {
    await this.quizRepo.update(id, data);
    return this.findQuizById(id);
  }

  async deleteQuiz(id: string): Promise<void> {
    await this.quizRepo.delete(id);
  }

  // ── Questions ──────────────────────────────────────────
  async createQuestion(data: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const q = this.questionRepo.create(data);
    return this.questionRepo.save(q);
  }

  async findQuestionsByQuizId(quizId: string): Promise<QuizQuestion[]> {
    return this.questionRepo.find({
      where: { quizId },
      order: { orderIndex: 'ASC' },
      relations: ['options'],
    });
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.questionRepo.delete(id);
  }

  // Picks N random questions, optionally for one quiz
  async getRandomQuestions(quizId: string, count: number): Promise<QuizQuestion[]> {
    return this.questionRepo
      .createQueryBuilder('q')
      .where('q.quizId = :quizId', { quizId })
      .leftJoinAndSelect('q.options', 'opt')
      .orderBy('RANDOM()')
      .take(count)
      .getMany();
  }

  // ── Options ────────────────────────────────────────────
  async createOption(data: Partial<QuizOption>): Promise<QuizOption> {
    const opt = this.optionRepo.create(data);
    return this.optionRepo.save(opt);
  }

  async deleteOption(id: string): Promise<void> {
    await this.optionRepo.delete(id);
  }

  // ── Answers ───────────────────────────────────────────
  async upsertAnswer(
    userId: string,
    quizId: string,
    questionId: string,
    selectedOptionId: string | undefined,
    openAnswer: string | undefined,
    isCorrect: boolean,
    scoreObtained: number,
  ): Promise<UserAnswer> {
    let answer = await this.answerRepo.findOne({
      where: { userId, quizId, questionId },
    });

    if (answer) {
      answer.selectedOptionId = selectedOptionId;
      answer.openAnswer = openAnswer;
      answer.isCorrect = isCorrect;
      answer.scoreObtained = scoreObtained;
      return this.answerRepo.save(answer);
    }

    const newAnswer = this.answerRepo.create({
      userId,
      quizId,
      questionId,
      selectedOptionId,
      openAnswer,
      isCorrect,
      scoreObtained,
    });
    return this.answerRepo.save(newAnswer);
  }

  async findUserAnswers(userId: string, quizId: string): Promise<UserAnswer[]> {
    return this.answerRepo.find({
      where: { userId, quizId },
      relations: ['question', 'selectedOption'],
    });
  }
}
