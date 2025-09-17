import { UserRepository } from "../Repositories/implementation/UserRepository";
import { CreateUserService } from "../../modules/User/Services/CreateUserService";
import { CreateUserDTO } from "../../modules/User/DTOs/CreateUserDTO";
import { ObjectId } from "mongodb";

export class AdminInitializerService {
  constructor(
    private userRepository: UserRepository,
    private createUserService: CreateUserService
  ) { }

  async initializeAdminUser(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nrctools.com';
    const adminName = process.env.ADMIN_NAME || 'Administrador';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    try {
      const existingAdmin = await this.userRepository.findByEmail(adminEmail);

      if (existingAdmin) {
        return;
      }

      const existingManagers = await this.userRepository.findByRole('manager');

      if (existingManagers && existingManagers.length > 0) {
        return;
      }

      const createdByUserId = new ObjectId();
      const adminData: CreateUserDTO = {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        demolayId: 999999,
        roles: ['manager'],
        permissions: ['admin', 'manager', 'user'],
        settings: {
          theme: 'light',
          language: 'pt-BR'
        },
        createdBy: createdByUserId
      };

      await this.createUserService.execute(adminData, createdByUserId);

    } catch (error) {
      console.error('❌ Erro ao criar usuário admin:', error);
      throw error;
    }
  }
}