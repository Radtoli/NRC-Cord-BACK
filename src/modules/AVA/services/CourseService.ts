import { CourseRepository } from '../repositories/CourseRepository';
import { Course, CourseStatus } from '../entities/Course';

export class CourseService {
  constructor(private courseRepository: CourseRepository) { }

  async create(data: {
    title: string;
    description?: string;
    coverImageUrl?: string;
    createdBy?: string;
  }): Promise<Course> {
    if (!data.title?.trim()) throw new Error('Title is required');

    return this.courseRepository.create({
      title: data.title.trim(),
      description: data.description,
      coverImageUrl: data.coverImageUrl,
      status: 'draft',
      createdBy: data.createdBy,
    });
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new Error('Course not found');
    return course;
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      coverImageUrl?: string;
      status?: CourseStatus;
    },
  ): Promise<Course> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) throw new Error('Course not found');

    if (data.title !== undefined && !data.title.trim()) throw new Error('Title cannot be empty');

    const updated = await this.courseRepository.update(id, {
      ...(data.title && { title: data.title.trim() }),
      description: data.description,
      coverImageUrl: data.coverImageUrl,
      status: data.status,
    });

    return updated!;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) throw new Error('Course not found');
    await this.courseRepository.delete(id);
  }
}
