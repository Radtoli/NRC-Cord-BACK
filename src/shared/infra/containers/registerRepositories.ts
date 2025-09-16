import { asClass, AwilixContainer } from "awilix";
import { DocumentRepository } from "../../Repositories/implementation/DocumentRepository";
import { TrilhaRepository } from "../../Repositories/implementation/TrilhaRepository";
import { UserRepository } from "../../Repositories/implementation/UserRepository";
import { VideoRepository } from "../../Repositories/implementation/VideoRepository";

export function registerRepositories(container: AwilixContainer): void {

  container.register('documentRepository', asClass(DocumentRepository).singleton());
  container.register('trilhaRepository', asClass(TrilhaRepository).singleton());
  container.register('userRepository', asClass(UserRepository).singleton());
  container.register('videoRepository', asClass(VideoRepository).singleton());
}