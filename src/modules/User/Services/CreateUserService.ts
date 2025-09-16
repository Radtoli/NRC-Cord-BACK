import { ObjectId } from "mongodb";
import { UserRepository } from "../../../shared/Repositories/implementation/UserRepository";
import { PasswordHasher } from "../../../shared/utils/PasswordHasher";
import { CreateUserDTO } from "../DTOs/CreateUserDTO";
import { UserResponseDTO } from "../DTOs/UserResponseDTO";
import { UserAlreadyExistsError, InvalidUserDataError } from "../Errors/UserErrors";

export class CreateUserService {
  constructor(private userRepository: UserRepository) { }

  async execute(data: CreateUserDTO, createdByUserId: ObjectId): Promise<UserResponseDTO> {
    await this.validateUserData(data);

    const passwordHash = await PasswordHasher.hash(data.password);

    const userData = {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      demolayId: data.demolayId,
      roles: data.roles || ['user'],
      permissions: data.permissions || [],
      status: 'active' as const,
      settings: {
        theme: data.settings?.theme || 'light',
        language: data.settings?.language || 'pt-BR'
      },
      meta: {
        createdBy: createdByUserId,
        updatedBy: createdByUserId,
        loginCount: 0,
        amountOfCheatChecks: 0
      }
    };

    const user = await this.userRepository.create(userData);

    return this.mapToResponseDTO(user);
  }

  private async validateUserData(data: CreateUserDTO): Promise<void> {
    const existingUserByEmail = await this.userRepository.findAll();
    const emailExists = existingUserByEmail.some(user =>
      user.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      throw new UserAlreadyExistsError('email', data.email);
    }

    const demolayIdExists = existingUserByEmail.some(user =>
      user.demolayId === data.demolayId
    );

    if (demolayIdExists) {
      throw new UserAlreadyExistsError('demolayId', data.demolayId.toString());
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new InvalidUserDataError('Invalid email format');
    }

    if (data.password.length < 6) {
      throw new InvalidUserDataError('Password must be at least 6 characters long');
    }

    if (data.demolayId <= 0) {
      throw new InvalidUserDataError('DeMolay ID must be a positive number');
    }
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