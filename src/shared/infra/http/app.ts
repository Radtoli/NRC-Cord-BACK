import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { config } from 'dotenv';
import fastify from 'fastify';
import path from 'path';
import { userRouter } from '../../../modules/User/Http/Routes/user.routes';
import { documentRouter } from '../../../modules/Document/Http/Routes/document.routes';
import { trilhaRoutes } from '../../../modules/Trilha/Http/Routes/trilhaRoutes';
import { videoRoutes } from '../../../modules/Video/Http/Routes/videoRoutes';
import { embeddingRoutes } from '../../../modules/Embeding/http/Routes/EmbeddingRoutes';
import { avaRoutes } from '../../../modules/AVA/http/routes/avaRoutes';

config();

const app = fastify({
  trustProxy: true,
  logger:
    process.env.NODE_ENV === 'dev'
      ? {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'dd/mm HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }
      : true,
});

// Configure CORS
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : process.env.NODE_ENV === 'production'
    ? [
      'https://nrc-coord-front-dev.up.railway.app',
      'https://nrc-coord-front.vercel.app',
    ]
    : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://nrc-coord-front-dev.up.railway.app',
      'https://nrc-coord-front.vercel.app',
    ];

app.register(fastifyCors, {
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});

if (process.env.NODE_ENV === 'development') {
  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'NRC Tools API',
        version: '1.0.0',
        contact: {
          email: 'raultorresoliveira@gmail.com',
          name: 'Raul Torres',
        },
        description:
          'API para gerenciar as ferramentas de suporte ao corretor do NRC',
      },
      host: 'localhost:3333',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    staticCSP: true,
  });
}

app.register(userRouter, { prefix: '/users' });
app.register(documentRouter, { prefix: '/documents' });
app.register(trilhaRoutes, { prefix: '/trilhas' });
app.register(videoRoutes, { prefix: '/videos' });
app.register(embeddingRoutes, { prefix: '/embedding' });
app.register(avaRoutes, { prefix: '/ava' });

// Multipart (for file uploads)
app.register(fastifyMultipart, {
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// Serve uploaded files statically
const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
app.register(fastifyStatic, {
  root: uploadDir,
  prefix: '/uploads/',
});

export { app };
