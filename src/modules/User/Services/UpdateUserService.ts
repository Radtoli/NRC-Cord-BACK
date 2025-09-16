import { ObjectId } from "mongodb";
import { UserRepository } from "../../../shared/Repositories/implementation/UserRepository";
import { UpdateUserDTO } from "../DTOs/UpdateUserDTO";
import { UserResponseDTO } from "../DTOs/UserResponseDTO";
import { UserNotFoundError, UserAlreadyExistsError, InvalidUserDataError } from "../Errors/UserErrors";

export class UpdateUserService {
  constructor(private userRepository: UserRepository) { }

  async execute(userId: ObjectId, data: UpdateUserDTO): Promise<UserResponseDTO> {
    // Buscar usuário a ser atualizado
    const user = await this.userRepository.findById(userId.toString());

    if (!user) {
      throw new UserNotFoundError(userId.toString());
    }

    // Validações de dados únicos se estão sendo alterados
    if (data.email && data.email.toLowerCase() !== user.email.toLowerCase()) {
      await this.validateUniqueEmail(data.email, userId);
    }

    if (data.demolayId && data.demolayId !== user.demolayId) {
      await this.validateUniqueDemolayId(data.demolayId, userId);
    }

    // Validações de formato
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new InvalidUserDataError('Invalid email format');
    }

    if (data.demolayId && data.demolayId <= 0) {
      throw new InvalidUserDataError('DeMolay ID must be a positive number');
    }

    // Preparar dados para atualização
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.demolayId) updateData.demolayId = data.demolayId;
    if (data.roles) updateData.roles = data.roles;
    if (data.permissions) updateData.permissions = data.permissions;
    if (data.status) updateData.status = data.status;
    if (data.settings) updateData.settings = data.settings;

    // Sempre atualizar meta com quem fez a alteração
    updateData.meta = {
      ...user.meta,
      updatedBy: data.updatedBy
    };

    // Atualizar usuário
    console.log('Updating user with data:', updateData);
    const updatedUser = await this.userRepository.update(userId.toString(), updateData);
    console.log('User updated, result:', updatedUser);

    // Retornar dados do usuário atualizado
    return this.mapToResponseDTO(updatedUser);
  }

  private async validateUniqueEmail(email: string, excludeUserId: ObjectId): Promise<void> {
    const users = await this.userRepository.findAll();
    const emailExists = users.some(user =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user._id.toString() !== excludeUserId.toString()
    );

    if (emailExists) {
      throw new UserAlreadyExistsError('email', email);
    }
  }

  private async validateUniqueDemolayId(demolayId: number, excludeUserId: ObjectId): Promise<void> {
    const users = await this.userRepository.findAll();
    const demolayIdExists = users.some(user =>
      user.demolayId === demolayId &&
      user._id.toString() !== excludeUserId.toString()
    );

    if (demolayIdExists) {
      throw new UserAlreadyExistsError('demolayId', demolayId.toString());
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