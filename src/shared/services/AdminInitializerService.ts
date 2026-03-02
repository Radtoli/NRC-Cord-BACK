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
      console.log('✅ Admin user created successfully');

    } catch (error) {
      // Se o usuário já existe (por email, demolayId ou role), não é um erro fatal —
      // apenas significa que o seed já foi executado anterior mente.
      const message = error instanceof Error ? error.message : String(error);
      if (
        message.includes('already exists') ||
        message.includes('duplicate') ||
        message.includes('E11000')
      ) {
        console.log('ℹ️  Admin user already exists, skipping initialization.');
        return;
      }
      // Erros reais (ex: MongoDB offline) devem ser logados mas não travar o boot
      console.error('⚠️  AdminInitializerService error (non-fatal):', message);
    }
  }
}