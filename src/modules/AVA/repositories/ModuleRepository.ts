import { DataSource, Repository } from 'typeorm';
import { Module } from '../entities/Module';

export class ModuleRepository {
  private get repo(): Repository<Module> {
    return this.postgresDataSource.getRepository(Module);
  }

  constructor(private postgresDataSource: DataSource) {}

  async create(data: Partial<Module>): Promise<Module> {
    const module = this.repo.create(data);
    return this.repo.save(module);
  }

  async findByCourseId(courseId: string): Promise<Module[]> {
    return this.repo.find({
      where: { courseId },
      order: { orderIndex: 'ASC' },
      relations: ['pages'],
    });
  }

  async findById(id: string): Promise<Module | null> {
    return this.repo.findOne({ where: { id }, relations: ['pages', 'course'] });
  }

  async update(id: string, data: Partial<Module>): Promise<Module | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async reorder(courseId: string, orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.repo.update(
        { id: orderedIds[i], courseId },
        { orderIndex: i },
      );
    }
  }
}
