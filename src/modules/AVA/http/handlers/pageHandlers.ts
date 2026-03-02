import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../../shared/infra/containers';
import { PageService } from '../../services/PageService';
import {
  CreatePageBodyType,
  UpdatePageBodyType,
  PageIdParamType,
  ReorderBodyType,
} from '../schemas/avaSchemas';

function getPageService() {
  return container.resolve<PageService>('avaPageService');
}

export async function createPageHandler(
  req: FastifyRequest<{ Body: CreatePageBodyType }>,
  reply: FastifyReply,
) {
  try {
    const page = await getPageService().create(req.body);
    return reply.status(201).send({ success: true, data: page });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function listPagesHandler(
  req: FastifyRequest<{ Params: { moduleId: string } }>,
  reply: FastifyReply,
) {
  try {
    const pages = await getPageService().findByModuleId(req.params.moduleId);
    return reply.send({ success: true, data: pages });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function getPageHandler(
  req: FastifyRequest<{ Params: PageIdParamType }>,
  reply: FastifyReply,
) {
  try {
    const page = await getPageService().findById(req.params.id);
    return reply.send({ success: true, data: page });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

/** Full page with ordered sections + content — for the renderer */
export async function getFullPageHandler(
  req: FastifyRequest<{ Params: PageIdParamType }>,
  reply: FastifyReply,
) {
  try {
    const page = await getPageService().findFullPage(req.params.id);
    return reply.send({ success: true, data: page });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function updatePageHandler(
  req: FastifyRequest<{ Params: PageIdParamType; Body: UpdatePageBodyType }>,
  reply: FastifyReply,
) {
  try {
    const page = await getPageService().update(req.params.id, req.body);
    return reply.send({ success: true, data: page });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deletePageHandler(
  req: FastifyRequest<{ Params: PageIdParamType }>,
  reply: FastifyReply,
) {
  try {
    await getPageService().delete(req.params.id);
    return reply.send({ success: true, message: 'Page deleted' });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function reorderPagesHandler(
  req: FastifyRequest<{ Body: ReorderBodyType }>,
  reply: FastifyReply,
) {
  try {
    await getPageService().reorder(req.body.parentId, req.body.orderedIds);
    return reply.send({ success: true, message: 'Pages reordered' });
  } catch (err: any) {
    return reply.status(400).send({ success: false, error: err.message });
  }
}
