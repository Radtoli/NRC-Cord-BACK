import { UserRepository } from "../../../shared/Repositories/implementation/UserRepository";
import { PasswordHasher } from "../../../shared/utils/PasswordHasher";
import { JWTUtils } from "../../../shared/utils/JWTUtils";
import { LoginDTO, LoginResponseDTO } from "../DTOs/LoginDTO";
import { InvalidCredentialsError, UserNotFoundError } from "../Errors/UserErrors";

export class LoginUserService {
  constructor(private userRepository: UserRepository) { }

  async execute(data: LoginDTO): Promise<LoginResponseDTO> {
    const users = await this.userRepository.findAll();
    const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (user.status !== 'active') {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await PasswordHasher.verify(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const updatedMeta = {
      ...user.meta,
      loginCount: user.meta.loginCount + 1
    };

    await this.userRepository.update(user._id.toString(), {
      lastLogin: new Date(),
      meta: updatedMeta
    });

    const token = JWTUtils.generateToken(user._id, user.email);

    return {
      user: {
        _id: user._id.toString(),
        name: String(user.name || ''),
        email: String(user.email || ''),
        roles: Array.isArray(user.roles) ? user.roles : [],
        permissions: Array.isArray(user.permissions) ? user.permissions : []
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
  }
}