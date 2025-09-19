import { createContainer } from 'awilix';
import { registerDataSources } from './registerDataSources';
import { registerProviders } from './registerProviders';
import { registerRepositories } from './registerRepositories';
import { registerServices } from './registerServices';

const container = createContainer({ injectionMode: 'CLASSIC' });

registerDataSources(container);
registerProviders(container);
registerRepositories(container);
registerServices(container);

export { container };
