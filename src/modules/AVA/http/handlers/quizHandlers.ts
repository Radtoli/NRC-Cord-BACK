import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../../shared/infra/containers';
import { QuizService } from '../../services/QuizService';
import {
  CreateQuizBodyType,
  UpdateQuizBodyType,
  AddQuestionBodyType,
  SubmitQuizBodyType,
  QuizIdParamType,
} from '../schemas/avaSchemas';

function getQuizService() {
  return container.resolve<QuizService>('avaQuizService');
}

export async function listQuizzesHandler(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const quizzes = await getQuizService().findAllQuizzes();
    return reply.send({ success: true, data: quizzes });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function getQuizHandler(
  req: FastifyRequest<{ Params: QuizIdParamType }>,
  reply: FastifyReply,
) {
  try {
    const quiz = await getQuizService().findQuizById(req.params.id);
    return reply.send({ success: true, data: quiz });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function getRandomizedQuizHandler(
  req: FastifyRequest<{ Params: QuizIdParamType }>,
  reply: FastifyReply,
) {
  try {
    const questions = await getQuizService().getRandomizedQuiz(req.params.id);
    return reply.send({ success: true, data: questions });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function createQuizHandler(
  req: FastifyRequest<{ Body: CreateQuizBodyType }>,
  reply: FastifyReply,
) {
  try {
    const quiz = await getQuizService().createQuiz(req.body);
    return reply.status(201).send({ success: true, data: quiz });
  } catch (err: any) {
    return reply.status(400).send({ success: false, error: err.message });
  }
}

export async function updateQuizHandler(
  req: FastifyRequest<{ Params: QuizIdParamType; Body: UpdateQuizBodyType }>,
  reply: FastifyReply,
) {
  try {
    const quiz = await getQuizService().updateQuiz(req.params.id, req.body);
    return reply.send({ success: true, data: quiz });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deleteQuizHandler(
  req: FastifyRequest<{ Params: QuizIdParamType }>,
  reply: FastifyReply,
) {
  try {
    await getQuizService().deleteQuiz(req.params.id);
    return reply.send({ success: true, message: 'Quiz deleted' });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function addQuestionHandler(
  req: FastifyRequest<{ Body: AddQuestionBodyType }>,
  reply: FastifyReply,
) {
  try {
    const question = await getQuizService().addQuestion(req.body as any);
    return reply.status(201).send({ success: true, data: question });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deleteQuestionHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    await getQuizService().deleteQuestion(req.params.id);
    return reply.send({ success: true, message: 'Question deleted' });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function submitQuizHandler(
  req: FastifyRequest<{ Body: SubmitQuizBodyType }>,
  reply: FastifyReply,
) {
  try {
    const userId = (req as any).user?._id?.toString();
    if (!userId) return reply.status(401).send({ success: false, error: 'Unauthorized' });

    const result = await getQuizService().submitQuiz(userId, req.body.quizId, req.body.answers);
    return reply.send({ success: true, data: result });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}
