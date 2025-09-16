import { ObjectId } from "mongodb";
import { CreateVideoDTO, UpdateVideoDTO } from "../DTOs/VideoDTO";
import { IVIdeoRepository } from "../../../shared/Repositories/model/IVideoRepository";
import { Video } from "../../../shared/infra/databases/Entititities/Video";

// Função utilitária para extrair YouTube ID
function extractYouTubeId(url: string): string {
  // Remove spaces and trim
  url = url.trim();

  // If it's already just the ID
  if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) {
    return url;
  }

  // Extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return url; // Return as is if no pattern matches
}

export class CreateVideoService {
  constructor(private videoRepository: IVIdeoRepository) { }

  async execute(data: CreateVideoDTO): Promise<Video> {
    const video = new Video();
    video.title = data.title;
    video.description = data.description;

    // Extrair youtubeId da URL
    video.youtubeId = extractYouTubeId(data.url);

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
      youtubeId: data.url ? extractYouTubeId(data.url) : undefined,
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