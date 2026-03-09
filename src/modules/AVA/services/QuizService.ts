import { QuizRepository } from '../repositories/QuizRepository';
import { Quiz } from '../entities/Quiz';
import { QuizQuestion, QuestionType } from '../entities/QuizQuestion';
import { QuizOption } from '../entities/QuizOption';

export interface QuizResultDTO {
  quizId: string;
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;          // 0–100 percentage
  passed: boolean;
  byAxis: Record<string, { correct: number; total: number; score: number }>;
  answers: Array<{
    questionId: string;
    selectedOptionId?: string;
    openAnswer?: string;
    isCorrect: boolean;
    scoreObtained: number;
    axis?: string;
  }>;
}

export class QuizService {
  constructor(private quizRepository: QuizRepository) { }

  // ── Quiz CRUD ──────────────────────────────────────────
  async createQuiz(data: {
    title: string;
    description?: string;
    randomizeQuestions?: boolean;
    questionsToShow?: number;
    passingScore?: number;
  }): Promise<Quiz> {
    if (!data.title?.trim()) throw new Error('Title is required');
    return this.quizRepository.createQuiz({
      title: data.title.trim(),
      description: data.description,
      randomizeQuestions: data.randomizeQuestions ?? true,
      questionsToShow: data.questionsToShow ?? 10,
      passingScore: data.passingScore ?? 60,
    });
  }

  async findQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findQuizById(id);
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  }

  async findAllQuizzes(): Promise<Quiz[]> {
    return this.quizRepository.findAllQuizzes();
  }

  async updateQuiz(
    id: string,
    data: {
      title?: string;
      description?: string;
      randomizeQuestions?: boolean;
      questionsToShow?: number;
      passingScore?: number;
    },
  ): Promise<Quiz> {
    const existing = await this.quizRepository.findQuizById(id);
    if (!existing) throw new Error('Quiz not found');
    const updated = await this.quizRepository.updateQuiz(id, data);
    return updated!;
  }

  async deleteQuiz(id: string): Promise<void> {
    const existing = await this.quizRepository.findQuizById(id);
    if (!existing) throw new Error('Quiz not found');
    await this.quizRepository.deleteQuiz(id);
  }

  // ── Questions ──────────────────────────────────────────
  async addQuestion(data: {
    quizId: string;
    statement: string;
    questionType?: QuestionType;
    axis?: string;
    weight?: number;
    orderIndex?: number;
    options?: Array<{ text: string; isCorrect?: boolean; scoreWeight?: number; orderIndex?: number }>;
  }): Promise<QuizQuestion> {
    const quiz = await this.quizRepository.findQuizById(data.quizId);
    if (!quiz) throw new Error('Quiz not found');

    const questionType: QuestionType = data.questionType ?? 'multiple_choice';

    // ── Type validations ──────────────────────────────────
    if (questionType === 'open') {
      // No options required
    } else if (questionType === 'multiple_choice') {
      if (!data.options || data.options.length < 2) {
        throw new Error('Questões de múltipla escolha precisam ter pelo menos 2 alternativas');
      }
      const correctCount = data.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        throw new Error('Questões de múltipla escolha precisam ter exatamente 1 alternativa correta');
      }
      data.options = data.options.map((o) => ({ ...o, scoreWeight: o.isCorrect ? 1 : 0 }));
    } else if (questionType === 'weighted') {
      if (!data.options || data.options.length < 2) {
        throw new Error('Questões ponderadas precisam ter pelo menos 2 alternativas');
      }
      for (const opt of data.options) {
        const w = opt.scoreWeight ?? 0;
        if (w < 0 || w > 1) throw new Error('Peso deve ser um valor entre 0.0 e 1.0');
      }
      data.options = data.options.map((o) => ({
        ...o,
        isCorrect: o.isCorrect ?? (o.scoreWeight ?? 0) > 0,
      }));
    }

    const existingQuestions = await this.quizRepository.findQuestionsByQuizId(data.quizId);
    const orderIndex = data.orderIndex ?? existingQuestions.length;

    const question = await this.quizRepository.createQuestion({
      quizId: data.quizId,
      statement: data.statement,
      questionType,
      axis: data.axis,
      weight: data.weight ?? 1,
      orderIndex,
    });

    // Create options (skip for open questions)
    if (questionType !== 'open' && data.options) {
      for (let i = 0; i < data.options.length; i++) {
        const opt = data.options[i];
        await this.quizRepository.createOption({
          questionId: question.id,
          text: opt.text,
          isCorrect: opt.isCorrect ?? false,
          scoreWeight: opt.scoreWeight ?? 0,
          orderIndex: opt.orderIndex ?? i,
        });
      }
    }

    // Re-fetch question with options
    const questions = await this.quizRepository.findQuestionsByQuizId(data.quizId);
    return questions.find((q) => q.id === question.id)!;
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.quizRepository.deleteQuestion(id);
  }

  async deleteOption(id: string): Promise<void> {
    await this.quizRepository.deleteOption(id);
  }

  // ── Quiz Submission ───────────────────────────────────
  async submitQuiz(
    userId: string,
    quizId: string,
    answers: Array<{ questionId: string; selectedOptionId?: string; openAnswer?: string }>,
  ): Promise<QuizResultDTO> {
    const quiz = await this.quizRepository.findQuizById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    let totalWeight = 0;
    let weightedScore = 0;
    const byAxis: Record<string, { correct: number; total: number; score: number }> = {};
    const savedAnswers: QuizResultDTO['answers'] = [];

    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      const weight = Number(question.weight);
      totalWeight += weight;

      let isCorrect = false;
      let scoreObtained = 0;

      if (question.questionType === 'open') {
        // Open questions: answered = full score (manual grading not yet implemented)
        isCorrect = !!(answer.openAnswer?.trim());
        scoreObtained = isCorrect ? 100 : 0;
      } else if (question.questionType === 'multiple_choice') {
        const selectedOpt = question.options.find((o) => o.id === answer.selectedOptionId);
        isCorrect = selectedOpt?.isCorrect ?? false;
        scoreObtained = isCorrect ? 100 : 0;
      } else if (question.questionType === 'weighted') {
        const selectedOpt = question.options.find((o) => o.id === answer.selectedOptionId);
        scoreObtained = selectedOpt?.scoreWeight ?? 0;
        isCorrect = scoreObtained === 100;
      }

      weightedScore += scoreObtained * weight;

      const axisKey = question.axis ?? 'Geral';
      if (!byAxis[axisKey]) byAxis[axisKey] = { correct: 0, total: 0, score: 0 };
      byAxis[axisKey].total += weight;
      if (isCorrect) byAxis[axisKey].correct += weight;

      // Persist answer
      await this.quizRepository.upsertAnswer(
        userId,
        quizId,
        answer.questionId,
        answer.selectedOptionId,
        answer.openAnswer,
        isCorrect,
        scoreObtained,
      );

      savedAnswers.push({
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        openAnswer: answer.openAnswer,
        isCorrect,
        scoreObtained,
        axis: question.axis,
      });
    }

    const score = totalWeight > 0 ? weightedScore / totalWeight : 0;

    for (const key of Object.keys(byAxis)) {
      const a = byAxis[key];
      a.score = a.total > 0 ? (a.correct / a.total) * 100 : 0;
    }

    return {
      quizId,
      userId,
      totalQuestions: answers.length,
      correctAnswers: savedAnswers.filter((a) => a.isCorrect).length,
      score: Math.round(score * 100) / 100,
      passed: score >= Number(quiz.passingScore),
      byAxis,
      answers: savedAnswers,
    };
  }

  /** Get N random questions for the quiz (for final assessment) */
  async getRandomizedQuiz(quizId: string): Promise<QuizQuestion[]> {
    const quiz = await this.quizRepository.findQuizById(quizId);
    if (!quiz) throw new Error('Quiz not found');
    return this.quizRepository.getRandomQuestions(quizId, quiz.questionsToShow);
  }
}
