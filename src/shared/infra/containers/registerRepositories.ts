import { asClass, AwilixContainer } from "awilix";
import { DocumentRepository } from "../../Repositories/implementation/DocumentRepository";
import { TrilhaRepository } from "../../Repositories/implementation/TrilhaRepository";
import { UserRepository } from "../../Repositories/implementation/UserRepository";
import { VideoRepository } from "../../Repositories/implementation/VideoRepository";

// AVA Repositories (PostgreSQL)
import { CourseRepository } from "../../../modules/AVA/repositories/CourseRepository";
import { ModuleRepository } from "../../../modules/AVA/repositories/ModuleRepository";
import { PageRepository } from "../../../modules/AVA/repositories/PageRepository";
import { SectionRepository } from "../../../modules/AVA/repositories/SectionRepository";
import { QuizRepository } from "../../../modules/AVA/repositories/QuizRepository";
import { ProgressRepository } from "../../../modules/AVA/repositories/ProgressRepository";
import { FileUploadRepository } from "../../../modules/AVA/repositories/FileUploadRepository";

// AVA Exam Repository (MongoDB)
import { ExamRepository } from "../../../modules/AVA/repositories/ExamRepository";

export function registerRepositories(container: AwilixContainer): void {
  container.register('documentRepository', asClass(DocumentRepository).singleton());
  container.register('trilhaRepository', asClass(TrilhaRepository).singleton());
  container.register('userRepository', asClass(UserRepository).singleton());
  container.register('videoRepository', asClass(VideoRepository).singleton());

  container.register('courseRepository', asClass(CourseRepository).singleton());
  container.register('moduleRepository', asClass(ModuleRepository).singleton());
  container.register('pageRepository', asClass(PageRepository).singleton());
  container.register('sectionRepository', asClass(SectionRepository).singleton());
  container.register('quizRepository', asClass(QuizRepository).singleton());
  container.register('progressRepository', asClass(ProgressRepository).singleton());
  container.register('fileUploadRepository', asClass(FileUploadRepository).singleton());

  container.register('examRepository', asClass(ExamRepository).singleton());
}