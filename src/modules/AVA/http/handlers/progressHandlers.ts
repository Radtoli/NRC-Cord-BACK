import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../../shared/infra/containers';
import { ProgressService } from '../../services/ProgressService';
import {
  RecordPageProgressBodyType,
  CourseDashboardParamType,
} from '../schemas/avaSchemas';

function getProgressService() {
  return container.resolve<ProgressService>('avaProgressService');
}

export async function recordPageProgressHandler(
  req: FastifyRequest<{ Body: RecordPageProgressBodyType }>,
  reply: FastifyReply,
) {
  try {
    const userId = (req as any).user?._id?.toString();
    if (!userId) return reply.status(401).send({ success: false, error: 'Unauthorized' });

    const progress = await getProgressService().recordPageProgress({
      userId,
      pageId: req.body.pageId,
      timeSpentSeconds: req.body.timeSpentSeconds,
      completed: req.body.completed,
    });

    return reply.send({ success: true, data: progress });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function getCourseDashboardHandler(
  req: FastifyRequest<{ Params: CourseDashboardParamType }>,
  reply: FastifyReply,
) {
  try {
    const userId = (req as any).user?._id?.toString();
    if (!userId) return reply.status(401).send({ success: false, error: 'Unauthorized' });

    // For dashboard, we return progress using existing data
    // allPageIds should come from a query but we pass [] for now and rely on DB data
    const dashboard = await getProgressService().getCourseDashboard(
      userId,
      req.params.courseId,
      [],
    );

    return reply.send({ success: true, data: dashboard });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function updatePageTimeHandler(
  req: FastifyRequest<{ Body: { pageId: string; seconds: number } }>,
  reply: FastifyReply,
) {
  try {
    const userId = (req as any).user?._id?.toString();
    if (!userId) return reply.status(401).send({ success: false, error: 'Unauthorized' });

    const progress = await getProgressService().updatePageTime(
      userId,
      req.body.pageId,
      req.body.seconds,
    );

    return reply.send({ success: true, data: progress });
  } catch (err: any) {
    return reply.status(400).send({ success: false, error: err.message });
  }
}
