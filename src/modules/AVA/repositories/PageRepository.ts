import { DataSource, Repository } from 'typeorm';
import { Page } from '../entities/Page';

export class PageRepository {
  private get repo(): Repository<Page> {
    return this.postgresDataSource.getRepository(Page);
  }

  constructor(private postgresDataSource: DataSource) { }

  async create(data: Partial<Page>): Promise<Page> {
    const page = this.repo.create(data);
    return this.repo.save(page);
  }

  async findByModuleId(moduleId: string): Promise<Page[]> {
    return this.repo.find({
      where: { moduleId, isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }

  async findById(id: string): Promise<Page | null> {
    return this.repo.findOne({ where: { id } });
  }

  /** Returns page + ordered sections + each section's content */
  async findFullPage(id: string): Promise<Page | null> {
    return this.repo.findOne({
      where: { id, isActive: true },
      relations: ['sections', 'sections.content'],
      order: { sections: { orderIndex: 'ASC' } } as any,
    });
  }

  async update(id: string, data: Partial<Page>): Promise<Page | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async reorder(moduleId: string, orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.repo.update(
        { id: orderedIds[i], moduleId },
        { orderIndex: i },
      );
    }
  }
}
