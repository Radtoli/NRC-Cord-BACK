import { DataSource, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { IVIdeoRepository } from "../model/IVideoRepository";
import { Video } from "../../infra/databases/Entititities";

export class VideoRepository implements IVIdeoRepository {
  private ormRepository: MongoRepository<Video>;

  constructor(private mongoDataSource: DataSource) {
    this.ormRepository = this.mongoDataSource.getMongoRepository(Video);
  }

  public async findById(id: string): Promise<any | null> {
    try {
      const objectId = new ObjectId(id);
      const video = await this.ormRepository.findOne({ where: { _id: objectId } });
      return video || null;
    } catch (error) {
      console.error('Error finding video by ID:', error);
      return null;
    }
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
    try {
      const objectId = new ObjectId(id);
      await this.ormRepository.update(objectId, data);
      const updatedVideo = await this.findById(id);
      return updatedVideo;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.ormRepository.delete(objectId);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
}