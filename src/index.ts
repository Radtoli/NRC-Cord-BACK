import { app } from './shared/infra/http/app';
import { startEnvironment } from './shared/utils/startEnv';

startEnvironment().then(async () => {
  console.log('Starting server...');

  app.listen({ port: Number(process.env.PORT), host: '0.0.0.0' });

  console.log(`🚀 Server running on port ${process.env.PORT || 3001}`);
});
