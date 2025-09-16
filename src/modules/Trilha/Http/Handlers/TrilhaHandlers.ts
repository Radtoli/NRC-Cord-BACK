import { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "mongodb";
import { CreateTrilhaBodyType, UpdateTrilhaBodyType, TrilhaIdParamType } from "../Schemas/TrilhaSchemas";
import { AuthorizationHeadersType } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { container } from "../../../../shared/infra/containers";
import { TrilhaService } from "../../Services/TrilhaService";

export async function createTrilhaHandler(
  request: FastifyRequest<{
    Body: CreateTrilhaBodyType;
    Headers: AuthorizationHeadersType;
  }>,
  reply: FastifyReply
) {
  try {
    const trilhaService = container.resolve<TrilhaService>('trilhaService');

    const createData = {
      title: request.body.title,
      description: request.body.description,
      videos: request.body.videos?.map((id: string) => new ObjectId(id))
    };

    const trilha = await trilhaService.create(createData);

    return reply.status(201).send({
      success: true,
      data: trilha,
      message: 'Trilha created successfully'
    });

  } catch (error) {
    console.error('CreateTrilhaHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Trilha creation failed'
    });
  }
}

export async function listTrilhasHandler(
  _request: FastifyRequest<{ Headers: AuthorizationHeadersType }>,
  reply: FastifyReply
) {
  try {
    const trilhaService = container.resolve<TrilhaService>('trilhaService');
    const trilhas = await trilhaService.findAll();

    return reply.status(200).send({
      success: true,
      data: trilhas,
      message: 'Trilhas retrieved successfully'
    });

  } catch (error) {
    console.error('ListTrilhasHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve trilhas'
    });
  }
}

export async function getTrilhaByIdHandler(
  request: FastifyRequest<{
    Headers: AuthorizationHeadersType;
    Params: TrilhaIdParamType;
  }>,
  reply: FastifyReply
) {
  try {
    const trilhaService = container.resolve<TrilhaService>('trilhaService');
    const trilhaId = new ObjectId(request.params.id);
    const trilha = await trilhaService.findById(trilhaId);

    return reply.status(200).send({
      success: true,
      data: trilha,
      message: 'Trilha retrieved successfully'
    });

  } catch (error) {
    console.error('GetTrilhaByIdHandler Error:', error);
    return reply.status(404).send({
      success: false,
      error: 'Not Found',
      message: 'Trilha not found'
    });
  }
}

export async function updateTrilhaHandler(
  request: FastifyRequest<{
    Body: UpdateTrilhaBodyType;
    Headers: AuthorizationHeadersType;
    Params: TrilhaIdParamType;
  }>,
  reply: FastifyReply
) {
  try {
    const trilhaService = container.resolve<TrilhaService>('trilhaService');

    const trilhaId = new ObjectId(request.params.id);
    const updateData = {
      title: request.body.title,
      description: request.body.description,
      videos: request.body.videos?.map((id: string) => new ObjectId(id))
    };

    const trilha = await trilhaService.update(trilhaId, updateData);

    return reply.status(200).send({
      success: true,
      data: trilha,
      message: 'Trilha updated successfully'
    });

  } catch (error) {
    console.error('UpdateTrilhaHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Trilha update failed'
    });
  }
}

export async function deleteTrilhaHandler(
  request: FastifyRequest<{
    Headers: AuthorizationHeadersType;
    Params: TrilhaIdParamType;
  }>,
  reply: FastifyReply
) {
  try {
    const trilhaService = container.resolve<TrilhaService>('trilhaService');
    const trilhaId = new ObjectId(request.params.id);
    await trilhaService.delete(trilhaId);

    return reply.status(200).send({
      success: true,
      message: 'Trilha deleted successfully'
    });

  } catch (error) {
    console.error('DeleteTrilhaHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Trilha deletion failed'
    });
  }
}