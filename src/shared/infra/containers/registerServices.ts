import { asClass, AwilixContainer } from 'awilix';
import { CreateUserService } from '../../../modules/User/Services/CreateUserService';
import { LoginUserService } from '../../../modules/User/Services/LoginUserService';
import { ChangePasswordService } from '../../../modules/User/Services/ChangePasswordService';
import { UpdateUserService } from '../../../modules/User/Services/UpdateUserService';
import { ListUsersService } from '../../../modules/User/Services/ListUsersService';
import { DeleteUserService } from '../../../modules/User/Services/DeleteUserService';

import { CreateDocumentService } from '../../../modules/Document/Services/CreateDocumentService';
import { UpdateDocumentService } from '../../../modules/Document/Services/UpdateDocumentService';
import { DeleteDocumentService } from '../../../modules/Document/Services/DeleteDocumentService';
import { ListDocumentsService } from '../../../modules/Document/Services/ListDocumentsService';

import { TrilhaService } from '../../../modules/Trilha/Services/TrilhaService';

import {
  CreateVideoService,
  UpdateVideoService,
  DeleteVideoService,
  ListVideosService,
  GetVideoByIdService,
} from '../../../modules/Video/Services/VideoService';

import {
  AddDocumentService,
  SearchDocumentService,
} from '../../../modules/Embeding/services/EmbeddingService';

// AVA Services (PostgreSQL)
import { CourseService } from '../../../modules/AVA/services/CourseService';
import { ModuleService } from '../../../modules/AVA/services/ModuleService';
import { PageService } from '../../../modules/AVA/services/PageService';
import { SectionService } from '../../../modules/AVA/services/SectionService';
import { QuizService } from '../../../modules/AVA/services/QuizService';
import { ProgressService } from '../../../modules/AVA/services/ProgressService';
import { UploadService } from '../../../modules/AVA/services/UploadService';

// AVA Exam Service (MongoDB)
import { ExamService } from '../../../modules/AVA/services/ExamService';

export function registerServices(container: AwilixContainer): void {
  container.register(
    'createUserService',
    asClass(CreateUserService).singleton(),
  );
  container.register('loginUserService', asClass(LoginUserService).singleton());
  container.register(
    'changePasswordService',
    asClass(ChangePasswordService).singleton(),
  );
  container.register(
    'updateUserService',
    asClass(UpdateUserService).singleton(),
  );
  container.register('listUsersService', asClass(ListUsersService).singleton());
  container.register(
    'deleteUserService',
    asClass(DeleteUserService).singleton(),
  );

  container.register(
    'createDocumentService',
    asClass(CreateDocumentService).singleton(),
  );
  container.register(
    'updateDocumentService',
    asClass(UpdateDocumentService).singleton(),
  );
  container.register(
    'deleteDocumentService',
    asClass(DeleteDocumentService).singleton(),
  );
  container.register(
    'listDocumentsService',
    asClass(ListDocumentsService).singleton(),
  );

  container.register('trilhaService', asClass(TrilhaService).singleton());

  container.register(
    'createVideoService',
    asClass(CreateVideoService).singleton(),
  );
  container.register(
    'updateVideoService',
    asClass(UpdateVideoService).singleton(),
  );
  container.register(
    'deleteVideoService',
    asClass(DeleteVideoService).singleton(),
  );
  container.register(
    'listVideosService',
    asClass(ListVideosService).singleton(),
  );
  container.register(
    'getVideoByIdService',
    asClass(GetVideoByIdService).singleton(),
  );

  container.register(
    'addDocumentService',
    asClass(AddDocumentService).singleton(),
  );
  container.register(
    'searchDocumentService',
    asClass(SearchDocumentService).singleton(),
  );

  // ── AVA Services (PostgreSQL) ────────────────────────────
  container.register('avaCourseService', asClass(CourseService).singleton());
  container.register('avaModuleService', asClass(ModuleService).singleton());
  container.register('avaPageService', asClass(PageService).singleton());
  container.register('avaSectionService', asClass(SectionService).singleton());
  container.register('avaQuizService', asClass(QuizService).singleton());
  container.register('avaProgressService', asClass(ProgressService).singleton());
  container.register('avaUploadService', asClass(UploadService).singleton());

  // ── AVA Exam Service (MongoDB) ───────────────────────────
  container.register('avaExamService', asClass(ExamService).singleton());
}
