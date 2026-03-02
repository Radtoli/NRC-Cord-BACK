import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../../../shared/infra/containers';
import { CourseService } from '../../services/CourseService';
import {
  CreateCourseBodyType,
  UpdateCourseBodyType,
  CourseIdParamType,
} from '../schemas/avaSchemas';

function getCourseService() {
  return container.resolve<CourseService>('avaCourseService');
}

export async function listCoursesHandler(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const courses = await getCourseService().findAll();
    return reply.send({ success: true, data: courses });
  } catch (err: any) {
    return reply.status(500).send({ success: false, error: err.message });
  }
}

export async function getCourseHandler(
  req: FastifyRequest<{ Params: CourseIdParamType }>,
  reply: FastifyReply,
) {
  try {
    const course = await getCourseService().findById(req.params.id);
    return reply.send({ success: true, data: course });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function createCourseHandler(
  req: FastifyRequest<{ Body: CreateCourseBodyType }>,
  reply: FastifyReply,
) {
  try {
    const course = await getCourseService().create({
      ...req.body,
      createdBy: (req as any).user?._id?.toString(),
    });
    return reply.status(201).send({ success: true, data: course });
  } catch (err: any) {
    return reply.status(400).send({ success: false, error: err.message });
  }
}

export async function updateCourseHandler(
  req: FastifyRequest<{ Params: CourseIdParamType; Body: UpdateCourseBodyType }>,
  reply: FastifyReply,
) {
  try {
    const course = await getCourseService().update(req.params.id, req.body);
    return reply.send({ success: true, data: course });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 400;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

export async function deleteCourseHandler(
  req: FastifyRequest<{ Params: CourseIdParamType }>,
  reply: FastifyReply,
) {
  try {
    await getCourseService().delete(req.params.id);
    return reply.send({ success: true, message: 'Course deleted' });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}
