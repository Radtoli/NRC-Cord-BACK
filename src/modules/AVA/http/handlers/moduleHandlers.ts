import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../../shared/infra/containers';
import { ModuleService } from '../../services/ModuleService';
import {
  CreateModuleBodyType,
  UpdateModuleBodyType,
  ModuleIdParamType,
  ReorderBodyType,
} from '../schemas/avaSchemas';

function getModuleService() {
  return container.resolve<ModuleService>('avaModuleService');
}

export async function createModuleHandler(
  req: FastifyRequest<{ Body: CreateModuleBodyType }>,
  reply: FastifyReply,
) {
  try {
    const module = await getModuleService().create(req.body);
    return reply.status(201).send({ success: true, data: module });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function listModulesHandler(
  req: FastifyRequest<{ Params: { courseId: string } }>,
  reply: FastifyReply,
) {
  try {
    const modules = await getModuleService().findByCourseId(req.params.courseId);
    return reply.send({ success: true, data: modules });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function getModuleHandler(
  req: FastifyRequest<{ Params: ModuleIdParamType }>,
  reply: FastifyReply,
) {
  try {
    const module = await getModuleService().findById(req.params.id);
    return reply.send({ success: true, data: module });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function updateModuleHandler(
  req: FastifyRequest<{ Params: ModuleIdParamType; Body: UpdateModuleBodyType }>,
  reply: FastifyReply,
) {
  try {
    const module = await getModuleService().update(req.params.id, req.body);
    return reply.send({ success: true, data: module });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deleteModuleHandler(
  req: FastifyRequest<{ Params: ModuleIdParamType }>,
  reply: FastifyReply,
) {
  try {
    await getModuleService().delete(req.params.id);
    return reply.send({ success: true, message: 'Module deleted' });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function reorderModulesHandler(
  req: FastifyRequest<{ Body: ReorderBodyType }>,
  reply: FastifyReply,
) {
  try {
    await getModuleService().reorder(req.body.parentId, req.body.orderedIds);
    return reply.send({ success: true, message: 'Modules reordered' });
  } catch (err: any) {
    return reply.status(400).send({ success: false, error: err.message });
  }
}
