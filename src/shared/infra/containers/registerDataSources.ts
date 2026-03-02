import { asValue, AwilixContainer } from 'awilix';
import { mongoDataSource } from '../databases/mongoDataSource';
import { qdrantDataSource } from '../databases/qdrantDataSource';
import { postgresDataSource } from '../databases/postgresDataSource';

export function registerDataSources(container: AwilixContainer): void {
  container.register('mongoDataSource', asValue(mongoDataSource));
  container.register('qdrantDataSource', asValue(qdrantDataSource));
  container.register('postgresDataSource', asValue(postgresDataSource));
}
