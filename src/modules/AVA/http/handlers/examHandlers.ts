import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../../shared/infra/containers';
import { ExamService, CreateExamQuestionDTO } from '../../services/ExamService';

function getExamService() {
  return container.resolve<ExamService>('avaExamService');
}

// ── Banks ─────────────────────────────────────────────────────────

export async function listBanksHandler(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const banks = await getExamService().listBanks();
    return reply.send({ success: true, data: banks });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function getBankHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const bank = await getExamService().getBankById(req.params.id);
    return reply.send({ success: true, data: bank });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function createBankHandler(
  req: FastifyRequest<{ Body: { title: string; description?: string; courseId?: string } }>,
  reply: FastifyReply,
) {
  try {
    const bank = await getExamService().createBank(req.body);
    return reply.status(201).send({ success: true, data: bank });
  } catch (err: any) {
    return reply.status(400).send({ success: false, error: err.message });
  }
}

export async function updateBankHandler(
  req: FastifyRequest<{ Params: { id: string }; Body: { title?: string; description?: string } }>,
  reply: FastifyReply,
) {
  try {
    const bank = await getExamService().updateBank(req.params.id, req.body);
    return reply.send({ success: true, data: bank });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deleteBankHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    await getExamService().deleteBank(req.params.id);
    return reply.send({ success: true, message: 'Banco excluído' });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

// ── Questions ─────────────────────────────────────────────────────

export async function listQuestionsHandler(
  req: FastifyRequest<{ Params: { bankId: string } }>,
  reply: FastifyReply,
) {
  try {
    const questions = await getExamService().listQuestions(req.params.bankId);
    return reply.send({ success: true, data: questions });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function addExamQuestionHandler(
  req: FastifyRequest<{ Body: any }>,
  reply: FastifyReply,
) {
  try {
    const question = await getExamService().addQuestion(req.body as CreateExamQuestionDTO);
    return reply.status(201).send({ success: true, data: question });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function updateExamQuestionHandler(
  req: FastifyRequest<{ Params: { id: string }; Body: any }>,
  reply: FastifyReply,
) {
  try {
    const question = await getExamService().updateQuestion(req.params.id, req.body as Partial<CreateExamQuestionDTO>);
    return reply.send({ success: true, data: question });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deleteExamQuestionHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    await getExamService().deleteQuestion(req.params.id);
    return reply.send({ success: true, message: 'Questão excluída' });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

// ── Exam execution ────────────────────────────────────────────────

export async function startExamHandler(
  req: FastifyRequest<{ Params: { moduleId: string } }>,
  reply: FastifyReply,
) {
  try {
    const userId = (req as any).user?._id?.toString();
    if (!userId) return reply.status(401).send({ success: false, error: 'Não autenticado' });

    // Resolve bankId from the module itself — avoids requiring the frontend to know it
    const moduleService = container.resolve<ModuleService>('avaModuleService');
    const module = await moduleService.findById(req.params.moduleId);
    if (!module.examBankId) {
      return reply.status(400).send({ success: false, error: 'Este módulo não tem banco de questões configurado' });
    }

    const attempt = await getExamService().startExam(
      userId,
      req.params.moduleId,
      module.examBankId,
    );
    return reply.status(201).send({ success: true, data: attempt });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') || err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function submitExamHandler(
  req: FastifyRequest<{ Body: { attemptId: string; answers: Array<{ questionId: string; answer: string }> } }>,
  reply: FastifyReply,
) {
  try {
    const userId = (req as any).user?._id?.toString();
    if (!userId) return reply.status(401).send({ success: false, error: 'Não autenticado' });

    const result = await getExamService().submitExam(
      req.body.attemptId,
      userId,
      req.body.answers,
    );
    return reply.send({ success: true, data: result });
  } catch (err: any) {
    const status = err.message.includes('não encontrado') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function myAttemptsHandler(
  req: FastifyRequest<{ Querystring: { moduleId?: string } }>,
  reply: FastifyReply,
) {
  try {
    const userId = (req as any).user?._id?.toString();
    if (!userId) return reply.status(401).send({ success: false, error: 'Não autenticado' });

    const attempts = await getExamService().getMyAttempts(userId, req.query.moduleId);
    return reply.send({ success: true, data: attempts });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

// ── Correction handlers (corretor / admin only) ───────────────────

export async function listPendingCorrectionsHandler(
  req: FastifyRequest<{ Querystring: { all?: string } }>,
  reply: FastifyReply,
) {
  try {
    const showAll = req.query.all === 'true';
    const data = showAll
      ? await getExamService().listAllCorrections()
      : await getExamService().listPendingCorrections();
    return reply.send({ success: true, data });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function getAttemptForCorrectionHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const data = await getExamService().getAttemptForCorrection(req.params.id);
    return reply.send({ success: true, data });
  } catch (err: any) {
    const status = err.message.includes('não encontrada') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function submitCorrectionHandler(
  req: FastifyRequest<{
    Params: { id: string };
    Body: { feedbacks: Array<{ questionId: string; feedback: string }>; generalFeedback?: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const correctorId = (req as any).user?._id?.toString();
    if (!correctorId) return reply.status(401).send({ success: false, error: 'Não autenticado' });

    const data = await getExamService().submitCorrection(req.params.id, correctorId, {
      feedbacks: req.body.feedbacks,
      generalFeedback: req.body.generalFeedback,
    });
    return reply.send({ success: true, data });
  } catch (err: any) {
    const status = err.message.includes('não encontrada') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}
