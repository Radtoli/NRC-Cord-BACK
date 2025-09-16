import { DataSource } from 'typeorm';
import { container } from '../infra/containers';
import { AdminInitializerService } from '../services/AdminInitializerService';
import { UserRepository } from '../Repositories/implementation/UserRepository';
import { CreateUserService } from '../../modules/User/Services/CreateUserService';

export async function startEnvironment() {
  const mongoDataSource = container.resolve<DataSource>('mongoDataSource');
  const qdrantDataSource = container.resolve('qdrantDataSource');

  try {
    // Inicializa MongoDB
    console.log('🔄 Conectando ao MongoDB...');
    await mongoDataSource.initialize();
    console.log('✅ MongoDB conectado com sucesso');

    // Inicializa Qdrant
    console.log('🔄 Conectando ao Qdrant...');
    await qdrantDataSource.initialize();
    console.log('✅ Qdrant conectado com sucesso');

    // Inicializar usuário admin
    console.log('🔄 Verificando usuário administrador...');
    const userRepository = container.resolve<UserRepository>('userRepository');
    const createUserService = container.resolve<CreateUserService>('createUserService');

    const adminInitializer = new AdminInitializerService(userRepository, createUserService);
    await adminInitializer.initializeAdminUser();

    console.log('🚀 Ambiente inicializado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao inicializar ambiente:', error);
    throw error;
  }
}