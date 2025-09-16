import { UserRepository } from "../Repositories/implementation/UserRepository";
import { CreateUserDTO } from "../../modules/User/DTOs/CreateUserDTO";
import { PasswordHasher } from "../utils/PasswordHasher";
import { ObjectId } from "mongodb";

export class AdminInitializerService {
  constructor(
    private userRepository: UserRepository
  ) { }

  async initializeAdminUser(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nrctools.com';
    const adminName = process.env.ADMIN_NAME || 'Administrador';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    try {
      // Verificar se já existe um usuário admin
      const existingAdmin = await this.userRepository.findByEmail(adminEmail);

      if (existingAdmin) {
        console.log('✅ Usuário admin já existe:', adminEmail);
        return;
      }

      // Verificar se existe pelo menos um usuário manager
      const existingManagers = await this.userRepository.findByRole('manager');

      if (existingManagers && existingManagers.length > 0) {
        console.log('✅ Usuários manager já existem no sistema');
        return;
      }

      // Criar usuário admin se não existir
      const hashedPassword = await PasswordHasher.hash(adminPassword);

      const adminData: CreateUserDTO = {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        demolayId: 999999, // ID especial para admin
        roles: ['manager'],
        permissions: ['admin', 'manager', 'user'],
        settings: {
          theme: 'light',
          language: 'pt-BR'
        },
        createdBy: new ObjectId() // Self-created
      };

      await this.userRepository.create(adminData);

      console.log('🚀 Usuário admin criado com sucesso!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Senha:', adminPassword);
      console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    } catch (error) {
      console.error('❌ Erro ao criar usuário admin:', error);
      throw error;
    }
  }
}