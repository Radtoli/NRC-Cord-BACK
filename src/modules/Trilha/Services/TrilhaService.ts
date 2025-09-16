import { ObjectId } from "mongodb";
import { TrilhaRepository } from "../../../shared/Repositories/implementation/TrilhaRepository";
import { CreateTrilhaDTO, UpdateTrilhaDTO, TrilhaResponseDTO } from "../DTOs/TrilhaDTO";

export class TrilhaService {
  constructor(private trilhaRepository: TrilhaRepository) { }

  async create(data: CreateTrilhaDTO): Promise<TrilhaResponseDTO> {
    if (!data.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    const trilhaData = {
      title: data.title,
      description: data.description,
      videos: data.videos || []
    };

    const trilha = await this.trilhaRepository.create(trilhaData);
    return this.mapToResponseDTO(trilha);
  }

  async findAll(): Promise<TrilhaResponseDTO[]> {
    const trilhas = await this.trilhaRepository.findAll();
    return trilhas.map(this.mapToResponseDTO);
  }

  async findById(id: ObjectId): Promise<TrilhaResponseDTO> {
    const trilha = await this.trilhaRepository.findById(id.toString());
    if (!trilha) {
      throw new Error('Trilha not found');
    }
    return this.mapToResponseDTO(trilha);
  }

  async update(id: ObjectId, data: UpdateTrilhaDTO): Promise<TrilhaResponseDTO> {
    const existingTrilha = await this.trilhaRepository.findById(id.toString());
    if (!existingTrilha) {
      throw new Error('Trilha not found');
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.videos !== undefined) updateData.videos = data.videos;

    const updatedTrilha = await this.trilhaRepository.update(id.toString(), updateData);
    return this.mapToResponseDTO(updatedTrilha);
  }

  async delete(id: ObjectId): Promise<void> {
    const existingTrilha = await this.trilhaRepository.findById(id.toString());
    if (!existingTrilha) {
      throw new Error('Trilha not found');
    }

    await this.trilhaRepository.delete(id.toString());
  }

  private mapToResponseDTO(trilha: any): TrilhaResponseDTO {
    return {
      _id: trilha._id,
      title: trilha.title,
      description: trilha.description,
      videos: trilha.videos,
      createdAt: trilha.createdAt,
      updatedAt: trilha.updatedAt
    };
  }
}