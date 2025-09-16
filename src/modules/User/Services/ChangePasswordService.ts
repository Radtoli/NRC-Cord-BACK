import { ObjectId } from "mongodb";
import { UserRepository } from "../../../shared/Repositories/implementation/UserRepository";
import { PasswordHasher } from "../../../shared/utils/PasswordHasher";
import { ChangePasswordDTO } from "../DTOs/ChangePasswordDTO";
import { UserNotFoundError, InvalidPasswordError, InvalidUserDataError } from "../Errors/UserErrors";

export class ChangePasswordService {
  constructor(private userRepository: UserRepository) { }

  async execute(data: ChangePasswordDTO): Promise<void> {
    // Buscar usuário
    const user = await this.userRepository.findById(data.userId.toString());

    if (!user) {
      throw new UserNotFoundError();
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await PasswordHasher.verify(
      data.currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      throw new InvalidPasswordError();
    }

    // Validar nova senha
    if (data.newPassword.length < 6) {
      throw new InvalidUserDataError('New password must be at least 6 characters long');
    }

    if (data.currentPassword === data.newPassword) {
      throw new InvalidUserDataError('New password must be different from current password');
    }

    // Gerar hash da nova senha
    const newPasswordHash = await PasswordHasher.hash(data.newPassword);

    // Atualizar senha no banco
    await this.userRepository.update(data.userId.toString(), {
      passwordHash: newPasswordHash,
      meta: {
        ...user.meta,
        updatedBy: data.userId
      }
    });
  }
}