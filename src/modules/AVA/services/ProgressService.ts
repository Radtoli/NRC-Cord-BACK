import { ProgressRepository } from '../repositories/ProgressRepository';
import { PageRepository } from '../repositories/PageRepository';
import { UserCourseProgress } from '../entities/UserCourseProgress';
import { UserPageProgress } from '../entities/UserPageProgress';

export interface CourseDashboardDTO {
  courseId: string;
  userId: string;
  completionPercentage: number;
  totalTimeSeconds: number;
  hoursStudied: number;
  finalScore?: number;
  pagesCompleted: number;
  completedAt?: Date;
}

export class ProgressService {
  constructor(
    private progressRepository: ProgressRepository,
    private pageRepository: PageRepository,
  ) { }

  /** Record time + completed status for a page */
  async recordPageProgress(data: {
    userId: string;
    pageId: string;
    timeSpentSeconds: number;
    completed?: boolean;
  }): Promise<UserPageProgress> {
    const page = await this.pageRepository.findById(data.pageId);
    if (!page) throw new Error('Page not found');

    return this.progressRepository.upsertPageProgress(data.userId, data.pageId, {
      timeSpentSeconds: data.timeSpentSeconds,
      completed: data.completed ?? false,
      lastAccess: new Date(),
    });
  }

  /** Recalculate and persist course-level progress */
  async recalculateCourseProgress(
    userId: string,
    courseId: string,
    finalScore?: number,
  ): Promise<UserCourseProgress> {
    // Get all pages for this course (across all modules)
    // We need a flat list — querying all pages via TypeORM cascade
    const allProgress = await this.progressRepository.findAllCourseProgress(userId);
    const courseProgressEntry = allProgress.find((p) => p.courseId === courseId);

    const completionPercentage = courseProgressEntry?.completionPercentage ?? 0;
    const totalTimeSeconds =
      (courseProgressEntry?.totalTimeSeconds ?? 0) +
      0; // caller should sum page time

    const update: Partial<UserCourseProgress> = {
      lastAccess: new Date(),
      completionPercentage,
      totalTimeSeconds,
    };

    if (finalScore !== undefined) {
      update.finalScore = finalScore;
      if (finalScore > 0 && completionPercentage >= 100) {
        update.completedAt = new Date();
      }
    }

    return this.progressRepository.upsertCourseProgress(userId, courseId, update);
  }

  /** Compute full course dashboard for a student */
  async getCourseDashboard(
    userId: string,
    courseId: string,
    allPageIds: string[],
  ): Promise<CourseDashboardDTO> {
    const progress = await this.progressRepository.findCourseProgress(userId, courseId);

    const pagesCompleted = await this.progressRepository.countCompletedPages(userId, allPageIds);
    const totalPages = allPageIds.length;
    const completionPercentage =
      totalPages > 0 ? Math.round((pagesCompleted / totalPages) * 100) : 0;

    const totalTimeSeconds = progress?.totalTimeSeconds ?? 0;

    return {
      courseId,
      userId,
      completionPercentage,
      totalTimeSeconds,
      hoursStudied: Math.round((totalTimeSeconds / 3600) * 100) / 100,
      finalScore: progress?.finalScore ? Number(progress.finalScore) : undefined,
      pagesCompleted,
      completedAt: progress?.completedAt,
    };
  }

  async updatePageTime(
    userId: string,
    pageId: string,
    additionalSeconds: number,
  ): Promise<UserPageProgress> {
    const existing = await this.progressRepository.findPageProgress(userId, pageId);
    const currentTime = existing?.timeSpentSeconds ?? 0;

    return this.progressRepository.upsertPageProgress(userId, pageId, {
      timeSpentSeconds: currentTime + additionalSeconds,
      lastAccess: new Date(),
    });
  }
}
