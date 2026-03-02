import { ModuleRepository } from '../repositories/ModuleRepository';
import { CourseRepository } from '../repositories/CourseRepository';
import { Module, ModuleType } from '../entities/Module';

export class ModuleService {
  constructor(
    private moduleRepository: ModuleRepository,
    private courseRepository: CourseRepository,
  ) { }

  async create(data: {
    courseId: string;
    title: string;
    description?: string;
    orderIndex?: number;
    moduleType?: ModuleType;
    examBankId?: string;
  }): Promise<Module> {
    if (!data.title?.trim()) throw new Error('Title is required');

    const course = await this.courseRepository.findById(data.courseId);
    if (!course) throw new Error('Course not found');

    const moduleType: ModuleType = data.moduleType ?? 'CONTENT';
    if (moduleType === 'PROVA' && !data.examBankId) {
      throw new Error('Módulos do tipo PROVA precisam de um banco de questões (examBankId)');
    }

    // Auto-set order if not provided
    const existingModules = await this.moduleRepository.findByCourseId(data.courseId);
    const orderIndex = data.orderIndex ?? existingModules.length;

    return this.moduleRepository.create({
      courseId: data.courseId,
      title: data.title.trim(),
      description: data.description,
      orderIndex,
      moduleType,
      examBankId: data.examBankId,
    });
  }

  async findByCourseId(courseId: string): Promise<Module[]> {
    return this.moduleRepository.findByCourseId(courseId);
  }

  async findById(id: string): Promise<Module> {
    const module = await this.moduleRepository.findById(id);
    if (!module) throw new Error('Module not found');
    return module;
  }

  async update(
    id: string,
    data: { title?: string; description?: string; orderIndex?: number; moduleType?: ModuleType; examBankId?: string },
  ): Promise<Module> {
    const existing = await this.moduleRepository.findById(id);
    if (!existing) throw new Error('Module not found');

    const newType = data.moduleType ?? existing.moduleType;
    if (newType === 'PROVA') {
      const bankId = data.examBankId ?? existing.examBankId;
      if (!bankId) throw new Error('Módulos do tipo PROVA precisam de um banco de questões (examBankId)');
    }

    const updated = await this.moduleRepository.update(id, data);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.moduleRepository.findById(id);
    if (!existing) throw new Error('Module not found');
    await this.moduleRepository.delete(id);
  }

  async reorder(courseId: string, orderedIds: string[]): Promise<void> {
    await this.moduleRepository.reorder(courseId, orderedIds);
  }
}
