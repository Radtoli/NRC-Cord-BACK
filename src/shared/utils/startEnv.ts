import { DataSource } from 'typeorm';
import { container } from '../infra/containers';
import { AdminInitializerService } from '../services/AdminInitializerService';
import { UserRepository } from '../Repositories/implementation/UserRepository';
import { CreateUserService } from '../../modules/User/Services/CreateUserService';

export async function startEnvironment() {
  const mongoDataSource = container.resolve<DataSource>('mongoDataSource');
  const qdrantDataSource = container.resolve('qdrantDataSource');
  const postgresDataSource = container.resolve<DataSource>('postgresDataSource');

  try {
    await mongoDataSource.initialize();

    await qdrantDataSource.initialize();

    // Initialize PostgreSQL for AVA module
    try {
      await postgresDataSource.initialize();
      console.log('✅ PostgreSQL connected (AVA module)');
    } catch (pgError) {
      console.warn('⚠️  PostgreSQL connection failed — AVA features unavailable:', pgError);
      // Non-fatal: rest of app continues without Postgres
    }

    const userRepository = container.resolve<UserRepository>('userRepository');
    const createUserService =
      container.resolve<CreateUserService>('createUserService');

    const adminInitializer = new AdminInitializerService(
      userRepository,
      createUserService,
    );
    await adminInitializer.initializeAdminUser();
  } catch (error) {

    throw error;
  }
}
