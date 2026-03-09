import { ExamRepository } from '../repositories/ExamRepository';
import { ExamBank } from '../../../shared/infra/databases/Entititities/ExamBank';
import { ExamQuestion, ExamOptionRaw, ExamQuestionType } from '../../../shared/infra/databases/Entititities/ExamQuestion';
import { ExamAttempt, AttemptQuestionSnapshot, AttemptAnswer, CorrectorFeedback, PlagiarismResult } from '../../../shared/infra/databases/Entititities/ExamAttempt';
import { AddDocumentService, SearchDocumentService } from '../../Embeding/services/EmbeddingService';

const EXAM_QUESTION_COUNT = 10;
const PASSING_SCORE = 60; // percentual mínimo para aprovação
/** Score >= threshold → potential plagiarism detected */
const PLAGIARISM_THRESHOLD = 0.85;

// ── DTOs ──────────────────────────────────────────────────────────

export interface CreateBankDTO {
  title: string;
  description?: string;
  courseId?: string;
}

export interface CreateExamQuestionDTO {
  bankId: string;
  statement: string;
  questionType: ExamQuestionType;
  axis?: string;
  options?: ExamOptionRaw[];
}

export interface ExamResultDTO {
  attemptId: string;
  moduleId: string;
  userId: string;
  totalQuestions: number;
  score: number;
  passed: boolean;
  byAxis: Record<string, { score: number; total: number }>;
  answers: AttemptAnswer[];
  hasOpenQuestions: boolean;
  plagiarismResults?: PlagiarismResult[];
}

export interface SubmitCorrectionDTO {
  feedbacks: CorrectorFeedback[];
  generalFeedback?: string;
}

export interface AttemptForCorrectionDTO {
  _id: string;
  moduleId: string;
  bankId: string;
  questions: AttemptQuestionSnapshot[];
  answers: AttemptAnswer[];
  score: number;
  passed: boolean;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  plagiarismResults?: PlagiarismResult[];
  correctorFeedbacks?: CorrectorFeedback[];
  generalFeedback?: string;
  correctedAt?: Date;
  correctorId?: string;
}

// ── Service ───────────────────────────────────────────────────────

export class ExamService {
  constructor(
    private examRepository: ExamRepository,
    private addDocumentService: AddDocumentService,
    private searchDocumentService: SearchDocumentService,
  ) { }

  // ── Banks ────────────────────────────────────────────────────────

  async createBank(data: CreateBankDTO): Promise<ExamBank> {
    if (!data.title?.trim()) throw new Error('Título do banco é obrigatório');
    return this.examRepository.createBank({
      title: data.title.trim(),
      description: data.description,
      courseId: data.courseId,
    });
  }

  async listBanks(): Promise<ExamBank[]> {
    return this.examRepository.findAllBanks();
  }

  async getBankById(id: string): Promise<ExamBank> {
    const bank = await this.examRepository.findBankById(id);
    if (!bank) throw new Error('Banco de questões não encontrado');
    return bank;
  }

  async updateBank(id: string, data: Partial<CreateBankDTO>): Promise<ExamBank> {
    const existing = await this.examRepository.findBankById(id);
    if (!existing) throw new Error('Banco de questões não encontrado');
    const updated = await this.examRepository.updateBank(id, data as Partial<ExamBank>);
    return updated!;
  }

  async deleteBank(id: string): Promise<void> {
    const existing = await this.examRepository.findBankById(id);
    if (!existing) throw new Error('Banco de questões não encontrado');
    await this.examRepository.deleteBank(id);
  }

  // ── Questions ────────────────────────────────────────────────────

  async addQuestion(data: CreateExamQuestionDTO): Promise<ExamQuestion> {
    const bank = await this.examRepository.findBankById(data.bankId);
    if (!bank) throw new Error('Banco de questões não encontrado');

    this._validateQuestion(data);

    return this.examRepository.createQuestion({
      bankId: data.bankId,
      statement: data.statement.trim(),
      questionType: data.questionType,
      axis: data.axis,
      options: data.options ?? [],
    });
  }

  async listQuestions(bankId: string): Promise<ExamQuestion[]> {
    await this.getBankById(bankId); // validates bank exists
    return this.examRepository.findQuestionsByBankId(bankId);
  }

  async updateQuestion(id: string, data: Partial<CreateExamQuestionDTO>): Promise<ExamQuestion> {
    const existing = await this.examRepository.findQuestionById(id);
    if (!existing) throw new Error('Questão não encontrada');

    const merged: CreateExamQuestionDTO = {
      bankId: existing.bankId,
      statement: data.statement ?? existing.statement,
      questionType: data.questionType ?? existing.questionType,
      axis: data.axis ?? existing.axis,
      options: data.options ?? existing.options,
    };
    this._validateQuestion(merged);

    const updated = await this.examRepository.updateQuestion(id, {
      statement: merged.statement,
      questionType: merged.questionType,
      axis: merged.axis,
      options: merged.options,
    });
    return updated!;
  }

  async deleteQuestion(id: string): Promise<void> {
    const existing = await this.examRepository.findQuestionById(id);
    if (!existing) throw new Error('Questão não encontrada');
    await this.examRepository.deleteQuestion(id);
  }

  // ── Exam execution ───────────────────────────────────────────────

  /**
   * Inicia uma prova: sorteia 10 questões aleatórias do banco, cria um ExamAttempt
   * e retorna o snapshot (sem gabaritos) para o aluno.
   */
  async startExam(userId: string, moduleId: string, bankId: string): Promise<ExamAttempt> {
    const bank = await this.examRepository.findBankById(bankId);
    if (!bank) throw new Error('Banco de questões não encontrado');

    const total = await this.examRepository.countQuestions(bankId);
    if (total === 0) throw new Error('O banco de questões não possui questões cadastradas');

    const randomQuestions = await this.examRepository.getRandomQuestions(
      bankId,
      Math.min(EXAM_QUESTION_COUNT, total),
    );

    const snapshots: AttemptQuestionSnapshot[] = randomQuestions.map((q) => ({
      questionId: q._id.toHexString(),
      statement: q.statement,
      questionType: q.questionType,
      axis: q.axis,
      // Strip isCorrect/scoreWeight from options sent to the student
      options: q.options.map(({ text }, idx) => ({ text, index: idx })) as any,
    }));

    return this.examRepository.createAttempt({
      userId,
      moduleId,
      bankId,
      questions: snapshots,
      answers: [],
      score: 0,
      passed: false,
      completed: false,
    });
  }

  /**
   * Submete respostas e calcula a nota.
   * answers: [{ questionId, answer }] — answer é o texto para open, índice (string) para múltipla.
   * Para questões abertas: registra no banco de anti-plágio e verifica similaridade.
   */
  async submitExam(
    attemptId: string,
    userId: string,
    answers: Array<{ questionId: string; answer: string }>,
  ): Promise<ExamResultDTO> {
    const attempt = await this.examRepository.findAttemptById(attemptId);
    if (!attempt) throw new Error('Tentativa não encontrada');
    if (attempt.userId !== userId) throw new Error('Acesso negado');
    if (attempt.completed) throw new Error('Esta prova já foi concluída');

    // Load full questions (with answers) from DB
    const fullQuestions = await Promise.all(
      attempt.questions.map((q) => this.examRepository.findQuestionById(q.questionId)),
    );

    let totalScore = 0;
    const byAxis: Record<string, { score: number; total: number }> = {};
    const savedAnswers: AttemptAnswer[] = [];
    const plagiarismResults: PlagiarismResult[] = [];
    let hasOpenQuestions = false;

    for (const snap of attempt.questions) {
      const fullQ = fullQuestions.find((fq) => fq?._id.toHexString() === snap.questionId);
      const userAnswer = answers.find((a) => a.questionId === snap.questionId);

      let scoreObtained = 0;

      if (fullQ && userAnswer) {
        if (snap.questionType === 'open') {
          hasOpenQuestions = true;
          // Open questions start with 0 — corrector grades later
          scoreObtained = 0;

          const answerText = userAnswer.answer.trim();
          if (answerText) {
            // Check plagiarism BEFORE registering
            let plagiarismPassed = true;
            const similarAttemptIds: string[] = [];

            try {
              const searchResults = await this.searchDocumentService.execute({
                query: answerText,
                provaId: attemptId,
                tipoProva: 'exam',
                numeroQuestao: snap.questionId as any,
                limit: 5,
              });

              for (const r of searchResults) {
                if (r.score >= PLAGIARISM_THRESHOLD) {
                  plagiarismPassed = false;
                  const similarId = (r as any).payload?.provaId;
                  if (similarId && !similarAttemptIds.includes(similarId)) {
                    similarAttemptIds.push(similarId);
                  }
                }
              }
            } catch (err) {
              // Embedding service unavailable — skip plagiarism check silently
              console.warn('[Plagiarism] Search failed:', (err as Error).message);
            }

            plagiarismResults.push({
              questionId: snap.questionId,
              passed: plagiarismPassed,
              similarAttemptIds,
            });

            // Register answer in anti-plagiarism bank
            try {
              await this.addDocumentService.execute({
                text: answerText,
                provaId: attemptId,
                tipoProva: 'exam',
                numeroQuestao: snap.questionId as any,
              });
            } catch (err) {
              console.warn('[Plagiarism] Add document failed:', (err as Error).message);
            }
          }
        } else if (snap.questionType === 'multiple_choice') {
          const chosenIdx = parseInt(userAnswer.answer, 10);
          const opt = fullQ.options[chosenIdx];
          scoreObtained = opt?.isCorrect ? 100 : 0;
        } else if (snap.questionType === 'weighted') {
          const chosenIdx = parseInt(userAnswer.answer, 10);
          const opt = fullQ.options[chosenIdx];
          scoreObtained = opt?.scoreWeight ?? 0;
        }
      }

      // Open questions start at 0 but don't count toward score until graded
      if (snap.questionType !== 'open') {
        totalScore += scoreObtained;
      }

      const axis = snap.axis ?? '__geral__';
      if (!byAxis[axis]) byAxis[axis] = { score: 0, total: 0 };
      if (snap.questionType !== 'open') {
        byAxis[axis].score += scoreObtained;
      }
      byAxis[axis].total += 1;

      savedAnswers.push({
        questionId: snap.questionId,
        answer: userAnswer?.answer ?? '',
        scoreObtained,
      });
    }

    const nonOpenCount = attempt.questions.filter((q) => q.questionType !== 'open').length;
    const finalScore = nonOpenCount > 0 ? totalScore / nonOpenCount : 0;
    const passed = !hasOpenQuestions && finalScore >= PASSING_SCORE;

    // Normalize byAxis scores to percentage
    for (const ax of Object.keys(byAxis)) {
      const axData = byAxis[ax];
      const axNonOpen = attempt.questions.filter(
        (q) => (q.axis ?? '__geral__') === ax && q.questionType !== 'open'
      ).length;
      byAxis[ax].score = axNonOpen > 0 ? axData.score / axNonOpen : 0;
    }

    await this.examRepository.updateAttempt(attemptId, {
      answers: savedAnswers,
      score: finalScore,
      passed,
      completed: true,
      completedAt: new Date(),
      plagiarismResults: plagiarismResults.length > 0 ? plagiarismResults : undefined,
    });

    return {
      attemptId,
      moduleId: attempt.moduleId,
      userId,
      totalQuestions: attempt.questions.length,
      score: finalScore,
      passed,
      byAxis,
      answers: savedAnswers,
      hasOpenQuestions,
      plagiarismResults,
    };
  }

  async getMyAttempts(userId: string, moduleId?: string): Promise<ExamAttempt[]> {
    return this.examRepository.findAttemptsByUser(userId, moduleId);
  }

  // ── Correction ── (corretor / admin only) ────────────────────────

  /** Lista attempts concluídos com questões abertas aguardando correção */
  async listPendingCorrections(): Promise<AttemptForCorrectionDTO[]> {
    const attempts = await this.examRepository.findPendingCorrections();
    return attempts.map(this._toAnonymousDTO);
  }

  /** Lista todos os attempts com questões abertas (corrigidos + pendentes) */
  async listAllCorrections(): Promise<AttemptForCorrectionDTO[]> {
    const attempts = await this.examRepository.findAllCompletedWithOpenQuestions();
    return attempts.map(this._toAnonymousDTO);
  }

  /** Retorna o attempt para correção sem expor o userId */
  async getAttemptForCorrection(attemptId: string): Promise<AttemptForCorrectionDTO> {
    const attempt = await this.examRepository.findAttemptById(attemptId);
    if (!attempt) throw new Error('Tentativa não encontrada');
    if (!attempt.completed) throw new Error('Esta prova ainda não foi concluída');
    return this._toAnonymousDTO(attempt);
  }

  /** Salva os feedbacks do corretor e marca a prova como corrigida */
  async submitCorrection(
    attemptId: string,
    correctorId: string,
    dto: SubmitCorrectionDTO,
  ): Promise<AttemptForCorrectionDTO> {
    const attempt = await this.examRepository.findAttemptById(attemptId);
    if (!attempt) throw new Error('Tentativa não encontrada');
    if (!attempt.completed) throw new Error('Esta prova ainda não foi concluída');

    // Calculate score contribution from corrected open questions
    const openQuestions = attempt.questions.filter((q) => q.questionType === 'open');
    // For now score for open questions isn't automatically set — corrector provides only feedback
    // Future: could parse rating from feedback

    await this.examRepository.updateAttempt(attemptId, {
      correctorId,
      correctorFeedbacks: dto.feedbacks,
      generalFeedback: dto.generalFeedback,
      correctedAt: new Date(),
    });

    return this.getAttemptForCorrection(attemptId);
  }

  /** Converts an ExamAttempt to an anonymous DTO (no userId) */
  private _toAnonymousDTO(attempt: ExamAttempt): AttemptForCorrectionDTO {
    return {
      _id: attempt._id.toHexString(),
      moduleId: attempt.moduleId,
      bankId: attempt.bankId,
      questions: attempt.questions,
      answers: attempt.answers,
      score: attempt.score,
      passed: attempt.passed,
      completed: attempt.completed,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      plagiarismResults: attempt.plagiarismResults,
      correctorFeedbacks: attempt.correctorFeedbacks,
      generalFeedback: attempt.generalFeedback,
      correctedAt: attempt.correctedAt,
      correctorId: attempt.correctorId,
    };
  }

  // ── Private helpers ──────────────────────────────────────────────

  private _validateQuestion(data: CreateExamQuestionDTO): void {
    if (!data.statement?.trim()) throw new Error('Enunciado da questão é obrigatório');

    if (data.questionType === 'open') {
      // No options required
      return;
    }

    if (data.questionType === 'multiple_choice') {
      if (!data.options || data.options.length !== 4) {
        throw new Error('Questões de múltipla escolha precisam ter exatamente 4 alternativas');
      }
      const correctCount = data.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        throw new Error('Questões de múltipla escolha precisam ter exatamente 1 alternativa correta');
      }
      data.options = data.options.map((o) => ({
        ...o,
        scoreWeight: o.isCorrect ? 100 : 0,
      }));
      return;
    }

    if (data.questionType === 'weighted') {
      if (!data.options || data.options.length !== 5) {
        throw new Error('Questões ponderadas precisam ter exatamente 5 alternativas');
      }
      const allowedWeights = new Set([0, 25, 50, 75, 100]);
      const seenWeights = new Set<number>();
      for (const opt of data.options) {
        if (!allowedWeights.has(opt.scoreWeight)) {
          throw new Error('Pesos válidos: 0, 25, 50, 75, 100');
        }
        if (seenWeights.has(opt.scoreWeight)) {
          throw new Error('Cada peso (0, 25, 50, 75, 100) deve aparecer exatamente uma vez');
        }
        seenWeights.add(opt.scoreWeight);
      }
      // Mark isCorrect for the 100% option
      data.options = data.options.map((o) => ({
        ...o,
        isCorrect: o.scoreWeight === 100,
      }));
    }
  }
}
