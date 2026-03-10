import { PageRepository } from '../repositories/PageRepository';
import { ModuleRepository } from '../repositories/ModuleRepository';
import { Page } from '../entities/Page';

export interface FullPageDTO {
  id: string;
  moduleId: string;
  title: string;
  slug?: string;
  orderIndex: number;
  isPublished: boolean;
  sections: FullSectionDTO[];
}

export interface FullSectionDTO {
  id: string;
  type: string;
  title: string;
  order: number;
  config: Record<string, unknown>;
  content: Record<string, unknown>;
}

export class PageService {
  constructor(
    private pageRepository: PageRepository,
    private moduleRepository: ModuleRepository,
  ) { }

  async create(data: {
    moduleId: string;
    title: string;
    slug?: string;
    orderIndex?: number;
  }): Promise<Page> {
    if (!data.title?.trim()) throw new Error('Title is required');

    const module = await this.moduleRepository.findById(data.moduleId);
    if (!module) throw new Error('Module not found');

    const existingPages = await this.pageRepository.findByModuleId(data.moduleId);
    const orderIndex = data.orderIndex ?? existingPages.length;

    return this.pageRepository.create({
      moduleId: data.moduleId,
      title: data.title.trim(),
      slug: data.slug,
      orderIndex,
    });
  }

  async findByModuleId(moduleId: string): Promise<Page[]> {
    return this.pageRepository.findByModuleId(moduleId);
  }

  async findById(id: string): Promise<Page> {
    const page = await this.pageRepository.findById(id);
    if (!page) throw new Error('Page not found');
    return page;
  }

  /** Returns page with all sections and their content — ready for renderer */
  async findFullPage(id: string): Promise<FullPageDTO> {
    const page = await this.pageRepository.findFullPage(id);
    if (!page) throw new Error('Page not found');

    const sections: FullSectionDTO[] = (page.sections ?? []).map((s) => ({
      id: s.id,
      type: s.type,
      title: s.title,
      order: s.orderIndex,
      config: s.config ?? {},
      content: s.content?.content ?? {},
    }));

    return {
      id: page.id,
      moduleId: page.moduleId,
      title: page.title,
      slug: page.slug,
      orderIndex: page.orderIndex,
      isPublished: page.isPublished,
      sections,
    };
  }

  async update(
    id: string,
    data: { title?: string; slug?: string; isPublished?: boolean; orderIndex?: number },
  ): Promise<Page> {
    const existing = await this.pageRepository.findById(id);
    if (!existing) throw new Error('Page not found');

    // Incrementar versão ao publicar
    const update: Partial<Page> = { ...data };
    if (data.isPublished && !existing.isPublished) {
      update.version = existing.version + 1;
    }

    const updated = await this.pageRepository.update(id, update);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.pageRepository.findById(id);
    if (!existing) throw new Error('Page not found');
    await this.pageRepository.delete(id);
  }

  async reorder(moduleId: string, orderedIds: string[]): Promise<void> {
    await this.pageRepository.reorder(moduleId, orderedIds);
  }
}
