import { DataSource } from 'typeorm';
import { container } from '../infra/containers';
import { AdminInitializerService } from '../services/AdminInitializerService';
import { UserRepository } from '../Repositories/implementation/UserRepository';
import { CreateUserService } from '../../modules/User/Services/CreateUserService';

export async function startEnvironment() {
  const mongoDataSource = container.resolve<DataSource>('mongoDataSource');
  const qdrantDataSource = container.resolve('qdrantDataSource');

  try {
    await mongoDataSource.initialize();

    await qdrantDataSource.initialize();

    const userRepository = container.resolve<UserRepository>('userRepository');
    const createUserService = container.resolve<CreateUserService>('createUserService');

    const adminInitializer = new AdminInitializerService(userRepository, createUserService);
    await adminInitializer.initializeAdminUser();

  } catch (error) {
    console.error('❌ Erro ao inicializar ambiente:', error);
    throw error;
  }
}