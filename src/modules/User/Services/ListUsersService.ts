import { ObjectId } from "mongodb";
import { UserRepository } from "../../../shared/Repositories/implementation/UserRepository";
import { UserResponseDTO } from "../DTOs/UserResponseDTO";
import { UserNotFoundError } from "../Errors/UserErrors";

export class ListUsersService {
  constructor(private userRepository: UserRepository) { }

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map((user: any) => this.mapToResponseDTO(user));
  }

  async executeById(id: string): Promise<UserResponseDTO | null> {
    if (!ObjectId.isValid(id)) {
      throw new UserNotFoundError();
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.mapToResponseDTO(user);
  }

  private mapToResponseDTO(user: any): UserResponseDTO {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      demolayId: user.demolayId,
      roles: user.roles,
      permissions: user.permissions,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      settings: user.settings,
      meta: user.meta
    };
  }
}