import { asClass, AwilixContainer } from 'awilix';
import { QdrantProvider } from '../providers/qdrantProvider';

export function registerProviders(container: AwilixContainer): void {
  container.register('qdrantProvider', asClass(QdrantProvider).singleton());
}
