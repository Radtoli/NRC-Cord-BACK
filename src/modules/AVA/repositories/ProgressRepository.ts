import { DataSource, Repository } from 'typeorm';
import { UserCourseProgress } from '../entities/UserCourseProgress';
import { UserPageProgress } from '../entities/UserPageProgress';

export class ProgressRepository {
  private get courseProgressRepo(): Repository<UserCourseProgress> {
    return this.postgresDataSource.getRepository(UserCourseProgress);
  }

  private get pageProgressRepo(): Repository<UserPageProgress> {
    return this.postgresDataSource.getRepository(UserPageProgress);
  }

  constructor(private postgresDataSource: DataSource) {}

  // ── Course Progress ────────────────────────────────────
  async upsertCourseProgress(
    userId: string,
    courseId: string,
    data: Partial<UserCourseProgress>,
  ): Promise<UserCourseProgress> {
    let progress = await this.courseProgressRepo.findOne({ where: { userId, courseId } });

    if (progress) {
      Object.assign(progress, data, { lastAccess: new Date() });
      return this.courseProgressRepo.save(progress);
    }

    const newProgress = this.courseProgressRepo.create({ userId, courseId, ...data });
    return this.courseProgressRepo.save(newProgress);
  }

  async findCourseProgress(userId: string, courseId: string): Promise<UserCourseProgress | null> {
    return this.courseProgressRepo.findOne({ where: { userId, courseId } });
  }

  async findAllCourseProgress(userId: string): Promise<UserCourseProgress[]> {
    return this.courseProgressRepo.find({
      where: { userId },
      relations: ['course'],
      order: { lastAccess: 'DESC' },
    });
  }

  // ── Page Progress ──────────────────────────────────────
  async upsertPageProgress(
    userId: string,
    pageId: string,
    data: Partial<UserPageProgress>,
  ): Promise<UserPageProgress> {
    let progress = await this.pageProgressRepo.findOne({ where: { userId, pageId } });

    if (progress) {
      Object.assign(progress, data, { lastAccess: new Date() });
      return this.pageProgressRepo.save(progress);
    }

    const newProgress = this.pageProgressRepo.create({ userId, pageId, ...data });
    return this.pageProgressRepo.save(newProgress);
  }

  async findPageProgress(userId: string, pageId: string): Promise<UserPageProgress | null> {
    return this.pageProgressRepo.findOne({ where: { userId, pageId } });
  }

  async countCompletedPages(userId: string, pageIds: string[]): Promise<number> {
    if (pageIds.length === 0) return 0;

    return this.pageProgressRepo.count({
      where: pageIds.map((pageId) => ({ userId, pageId, completed: true })) as any,
    });
  }
}
