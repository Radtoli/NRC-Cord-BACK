import { asValue, AwilixContainer } from 'awilix';
import { mongoDataSource } from '../databases/mongoDataSource';
import { qdrantDataSource } from '../databases/qdrantDataSource';

export function registerDataSources(container: AwilixContainer): void {
  container.register('mongoDataSource', asValue(mongoDataSource));
  container.register('qdrantDataSource', asValue(qdrantDataSource));
}
