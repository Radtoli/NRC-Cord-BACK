import { DataSource, Repository } from 'typeorm';
import { Section } from '../entities/Section';
import { SectionContent } from '../entities/SectionContent';

export class SectionRepository {
  private get repo(): Repository<Section> {
    return this.postgresDataSource.getRepository(Section);
  }

  private get contentRepo(): Repository<SectionContent> {
    return this.postgresDataSource.getRepository(SectionContent);
  }

  constructor(private postgresDataSource: DataSource) {}

  async create(data: Partial<Section>): Promise<Section> {
    const section = this.repo.create(data);
    return this.repo.save(section);
  }

  async findByPageId(pageId: string): Promise<Section[]> {
    return this.repo.find({
      where: { pageId },
      order: { orderIndex: 'ASC' },
      relations: ['content'],
    });
  }

  async findById(id: string): Promise<Section | null> {
    return this.repo.findOne({ where: { id }, relations: ['content'] });
  }

  async update(id: string, data: Partial<Section>): Promise<Section | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async upsertContent(
    sectionId: string,
    content: Record<string, unknown>,
  ): Promise<SectionContent> {
    const sectionContent = await this.contentRepo.findOne({
      where: { sectionId },
    });

    if (sectionContent) {
      sectionContent.content = content;
      return this.contentRepo.save(sectionContent);
    }

    const newContent = this.contentRepo.create({ sectionId, content });
    return this.contentRepo.save(newContent);
  }

  async reorder(pageId: string, orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.repo.update({ id: orderedIds[i], pageId }, { orderIndex: i });
    }
  }
}
