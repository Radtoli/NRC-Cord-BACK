import { DataSource, Repository } from 'typeorm';
import { Course, CourseStatus } from '../entities/Course';

export class CourseRepository {
  private get repo(): Repository<Course> {
    return this.postgresDataSource.getRepository(Course);
  }

  constructor(private postgresDataSource: DataSource) {}

  async create(data: Partial<Course>): Promise<Course> {
    const course = this.repo.create(data);
    return this.repo.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Course | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['modules', 'modules.pages'],
      order: { modules: { orderIndex: 'ASC', pages: { orderIndex: 'ASC' } } } as any,
    });
  }

  async update(id: string, data: Partial<Course>): Promise<Course | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByStatus(status: CourseStatus): Promise<Course[]> {
    return this.repo.find({ where: { status }, order: { createdAt: 'DESC' } });
  }
}
