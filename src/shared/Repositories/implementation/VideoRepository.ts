import { DataSource, MongoRepository } from "typeorm";
import { IVIdeoRepository } from "../model/IVideoRepository";
import { Video } from "../../infra/databases/Entititities";

export class VideoRepository implements IVIdeoRepository {
  private ormRepository: MongoRepository<Video>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(Video);
  }

  public async findById(id: string): Promise<any | null> {
    const video = await this.ormRepository.findOne({ where: { id } });
    return video || null;
  }

  public async findAll(): Promise<any[]> {
    const videos = await this.ormRepository.find();
    return videos;
  }

  public async create(data: Partial<Video>): Promise<any> {
    const video = this.ormRepository.create(data);
    await this.ormRepository.save(video);
    return video;
  }

  public async update(id: string, data: Partial<Video>): Promise<any> {
    await this.ormRepository.update(id, data);
    const updatedVideo = await this.findById(id);
    return updatedVideo;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}