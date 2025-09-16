import { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "mongodb";
import { CreateVideoBodyType, UpdateVideoBodyType, VideoIdParamType } from "../Schemas/VideoSchemas";
import { AuthorizationHeadersType } from "../../../User/Http/Schemas/Header/authorizationHeadersSchema";
import { container } from "../../../../shared/infra/containers";
import { CreateVideoService, UpdateVideoService, DeleteVideoService, ListVideosService, GetVideoByIdService } from "../../Services/VideoService";

export async function createVideoHandler(
  request: FastifyRequest<{
    Body: CreateVideoBodyType;
    Headers: AuthorizationHeadersType;
  }>,
  reply: FastifyReply
) {
  try {
    const createVideoService = container.resolve<CreateVideoService>('createVideoService');

    const createData = {
      title: request.body.title,
      description: request.body.description,
      url: request.body.url,
      duration: request.body.duration,
      trilhaId: request.body.trilhaId
    };

    const video = await createVideoService.execute(createData);

    return reply.status(201).send({
      success: true,
      data: video,
      message: 'Video created successfully'
    });

  } catch (error) {
    console.error('CreateVideoHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Video creation failed'
    });
  }
}

export async function listVideosHandler(
  _request: FastifyRequest<{ Headers: AuthorizationHeadersType }>,
  reply: FastifyReply
) {
  try {
    const listVideosService = container.resolve<ListVideosService>('listVideosService');
    const videos = await listVideosService.execute();

    return reply.status(200).send({
      success: true,
      data: videos,
      message: 'Videos retrieved successfully'
    });

  } catch (error) {
    console.error('ListVideosHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve videos'
    });
  }
}

export async function getVideoByIdHandler(
  request: FastifyRequest<{
    Headers: AuthorizationHeadersType;
    Params: VideoIdParamType;
  }>,
  reply: FastifyReply
) {
  try {
    const getVideoByIdService = container.resolve<GetVideoByIdService>('getVideoByIdService');
    const videoId = new ObjectId(request.params.id);
    const video = await getVideoByIdService.execute(videoId);

    return reply.status(200).send({
      success: true,
      data: video,
      message: 'Video retrieved successfully'
    });

  } catch (error) {
    console.error('GetVideoByIdHandler Error:', error);
    return reply.status(404).send({
      success: false,
      error: 'Not Found',
      message: 'Video not found'
    });
  }
}

export async function updateVideoHandler(
  request: FastifyRequest<{
    Body: UpdateVideoBodyType;
    Headers: AuthorizationHeadersType;
    Params: VideoIdParamType;
  }>,
  reply: FastifyReply
) {
  try {
    const updateVideoService = container.resolve<UpdateVideoService>('updateVideoService');

    const videoId = new ObjectId(request.params.id);
    const updateData = {
      title: request.body.title,
      description: request.body.description,
      url: request.body.url,
      duration: request.body.duration,
      trilhaId: request.body.trilhaId
    };

    const video = await updateVideoService.execute(videoId, updateData);

    return reply.status(200).send({
      success: true,
      data: video,
      message: 'Video updated successfully'
    });

  } catch (error) {
    console.error('UpdateVideoHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Video update failed'
    });
  }
}

export async function deleteVideoHandler(
  request: FastifyRequest<{
    Headers: AuthorizationHeadersType;
    Params: VideoIdParamType;
  }>,
  reply: FastifyReply
) {
  try {
    const deleteVideoService = container.resolve<DeleteVideoService>('deleteVideoService');
    const videoId = new ObjectId(request.params.id);
    await deleteVideoService.execute(videoId);

    return reply.status(200).send({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('DeleteVideoHandler Error:', error);
    return reply.status(500).send({
      success: false,
      error: 'Internal Server Error',
      message: 'Video deletion failed'
    });
  }
}