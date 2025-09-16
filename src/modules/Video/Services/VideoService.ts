import { ObjectId } from "mongodb";
import { CreateVideoDTO, UpdateVideoDTO } from "../DTOs/VideoDTO";
import { IVIdeoRepository } from "../../../shared/Repositories/model/IVideoRepository";
import { Video } from "../../../shared/infra/databases/Entititities/Video";

export class CreateVideoService {
  constructor(private videoRepository: IVIdeoRepository) { }

  async execute(data: CreateVideoDTO): Promise<Video> {
    const video = new Video();
    video.title = data.title;
    video.description = data.description;
    video.youtubeId = data.url; // Assumindo que url é o youtubeId
    video.duration = data.duration?.toString();
    video.trilha = data.trilhaId ? new ObjectId(data.trilhaId) : new ObjectId();
    video.documents = [];
    video.createdAt = new Date();
    video.updatedAt = new Date();

    return await this.videoRepository.create(video);
  }
}

export class UpdateVideoService {
  constructor(private videoRepository: IVIdeoRepository) { }

  async execute(id: ObjectId, data: UpdateVideoDTO): Promise<Video | null> {
    const updateData: Partial<Video> = {
      ...data,
      youtubeId: data.url,
      duration: data.duration?.toString(),
      trilha: data.trilhaId ? new ObjectId(data.trilhaId) : undefined,
      updatedAt: new Date()
    };

    return await this.videoRepository.update(id.toString(), updateData);
  }
}

export class DeleteVideoService {
  constructor(private videoRepository: IVIdeoRepository) { }

  async execute(id: ObjectId): Promise<void> {
    await this.videoRepository.delete(id.toString());
  }
}

export class ListVideosService {
  constructor(private videoRepository: IVIdeoRepository) { }

  async execute(): Promise<Video[]> {
    return await this.videoRepository.findAll();
  }
}

export class GetVideoByIdService {
  constructor(private videoRepository: IVIdeoRepository) { }

  async execute(id: ObjectId): Promise<Video | null> {
    return await this.videoRepository.findById(id.toString());
  }
}