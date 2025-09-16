import { asClass, AwilixContainer } from "awilix";
import { CreateUserService } from "../../../modules/User/Services/CreateUserService";
import { LoginUserService } from "../../../modules/User/Services/LoginUserService";
import { ChangePasswordService } from "../../../modules/User/Services/ChangePasswordService";
import { UpdateUserService } from "../../../modules/User/Services/UpdateUserService";
import { ListUsersService } from "../../../modules/User/Services/ListUsersService";
import { DeleteUserService } from "../../../modules/User/Services/DeleteUserService";

// Document Services
import { CreateDocumentService } from "../../../modules/Document/Services/CreateDocumentService";
import { UpdateDocumentService } from "../../../modules/Document/Services/UpdateDocumentService";
import { DeleteDocumentService } from "../../../modules/Document/Services/DeleteDocumentService";
import { ListDocumentsService } from "../../../modules/Document/Services/ListDocumentsService";

// Trilha Services
import { TrilhaService } from "../../../modules/Trilha/Services/TrilhaService";

// Video Services
import { CreateVideoService, UpdateVideoService, DeleteVideoService, ListVideosService, GetVideoByIdService } from "../../../modules/Video/Services/VideoService";

export function registerServices(container: AwilixContainer): void {
  // User Services
  container.register('createUserService', asClass(CreateUserService).singleton());
  container.register('loginUserService', asClass(LoginUserService).singleton());
  container.register('changePasswordService', asClass(ChangePasswordService).singleton());
  container.register('updateUserService', asClass(UpdateUserService).singleton());
  container.register('listUsersService', asClass(ListUsersService).singleton());
  container.register('deleteUserService', asClass(DeleteUserService).singleton());

  // Document Services
  container.register('createDocumentService', asClass(CreateDocumentService).singleton());
  container.register('updateDocumentService', asClass(UpdateDocumentService).singleton());
  container.register('deleteDocumentService', asClass(DeleteDocumentService).singleton());
  container.register('listDocumentsService', asClass(ListDocumentsService).singleton());

  // Trilha Services
  container.register('trilhaService', asClass(TrilhaService).singleton());

  // Video Services
  container.register('createVideoService', asClass(CreateVideoService).singleton());
  container.register('updateVideoService', asClass(UpdateVideoService).singleton());
  container.register('deleteVideoService', asClass(DeleteVideoService).singleton());
  container.register('listVideosService', asClass(ListVideosService).singleton());
  container.register('getVideoByIdService', asClass(GetVideoByIdService).singleton());
}