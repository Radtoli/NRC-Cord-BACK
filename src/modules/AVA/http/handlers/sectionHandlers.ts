import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../../shared/infra/containers';
import { SectionService } from '../../services/SectionService';
import {
  CreateSectionBodyType,
  UpdateSectionBodyType,
  UpdateSectionContentBodyType,
  SectionIdParamType,
  ReorderBodyType,
} from '../schemas/avaSchemas';

function getSectionService() {
  return container.resolve<SectionService>('avaSectionService');
}

export async function createSectionHandler(
  req: FastifyRequest<{ Body: CreateSectionBodyType }>,
  reply: FastifyReply,
) {
  try {
    const section = await getSectionService().create(req.body as any);
    return reply.status(201).send({ success: true, data: section });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function listSectionsHandler(
  req: FastifyRequest<{ Params: { pageId: string } }>,
  reply: FastifyReply,
) {
  try {
    const sections = await getSectionService().findByPageId(req.params.pageId);
    return reply.send({ success: true, data: sections });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function getSectionHandler(
  req: FastifyRequest<{ Params: SectionIdParamType }>,
  reply: FastifyReply,
) {
  try {
    const section = await getSectionService().findById(req.params.id);
    return reply.send({ success: true, data: section });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function updateSectionHandler(
  req: FastifyRequest<{ Params: SectionIdParamType; Body: UpdateSectionBodyType }>,
  reply: FastifyReply,
) {
  try {
    const section = await getSectionService().update(req.params.id, req.body);
    return reply.send({ success: true, data: section });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function updateSectionContentHandler(
  req: FastifyRequest<{ Params: SectionIdParamType; Body: UpdateSectionContentBodyType }>,
  reply: FastifyReply,
) {
  try {
    const content = await getSectionService().updateContent(req.params.id, req.body.content);
    return reply.send({ success: true, data: content });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deleteSectionHandler(
  req: FastifyRequest<{ Params: SectionIdParamType }>,
  reply: FastifyReply,
) {
  try {
    await getSectionService().delete(req.params.id);
    return reply.send({ success: true, message: 'Section deleted' });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function reorderSectionsHandler(
  req: FastifyRequest<{ Body: ReorderBodyType }>,
  reply: FastifyReply,
) {
  try {
    await getSectionService().reorder(req.body.parentId, req.body.orderedIds);
    return reply.send({ success: true, message: 'Sections reordered' });
  } catch (err: any) {
    return reply.status(400).send({ success: false, error: err.message });
  }
}
