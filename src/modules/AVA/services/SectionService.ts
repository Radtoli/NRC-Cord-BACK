import { SectionRepository } from '../repositories/SectionRepository';
import { PageRepository } from '../repositories/PageRepository';
import { Section, SectionType } from '../entities/Section';
import { SectionContent } from '../entities/SectionContent';

export class SectionService {
  constructor(
    private sectionRepository: SectionRepository,
    private pageRepository: PageRepository,
  ) { }

  async create(data: {
    pageId: string;
    type: SectionType;
    title: string;
    orderIndex?: number;
    config?: Record<string, unknown>;
  }): Promise<Section> {
    if (!data.title?.trim()) throw new Error('Title is required');

    const page = await this.pageRepository.findById(data.pageId);
    if (!page) throw new Error('Page not found');

    const existingSections = await this.sectionRepository.findByPageId(data.pageId);
    const orderIndex = data.orderIndex ?? existingSections.length;

    return this.sectionRepository.create({
      pageId: data.pageId,
      type: data.type,
      title: data.title.trim(),
      orderIndex,
      config: data.config ?? {},
    });
  }

  async findByPageId(pageId: string): Promise<Section[]> {
    return this.sectionRepository.findByPageId(pageId);
  }

  async findById(id: string): Promise<Section> {
    const section = await this.sectionRepository.findById(id);
    if (!section) throw new Error('Section not found');
    return section;
  }

  async update(
    id: string,
    data: {
      title?: string;
      orderIndex?: number;
      config?: Record<string, unknown>;
    },
  ): Promise<Section> {
    const existing = await this.sectionRepository.findById(id);
    if (!existing) throw new Error('Section not found');
    const updated = await this.sectionRepository.update(id, data);
    return updated!;
  }

  async updateContent(
    sectionId: string,
    content: Record<string, unknown>,
  ): Promise<SectionContent> {
    const section = await this.sectionRepository.findById(sectionId);
    if (!section) throw new Error('Section not found');
    return this.sectionRepository.upsertContent(sectionId, content);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.sectionRepository.findById(id);
    if (!existing) throw new Error('Section not found');
    await this.sectionRepository.delete(id);
  }

  async reorder(pageId: string, orderedIds: string[]): Promise<void> {
    await this.sectionRepository.reorder(pageId, orderedIds);
  }
}
