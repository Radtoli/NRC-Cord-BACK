import { Type, Static } from "@sinclair/typebox";

// Schema para criação de vídeo
export const createVideoBodySchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 200 }),
  description: Type.String({ minLength: 1, maxLength: 1000 }),
  url: Type.String({ minLength: 1 }), // Remover format: 'uri' para aceitar URLs do YouTube
  duration: Type.Optional(Type.Number({ minimum: 0 })),
  trilhaId: Type.String({ minLength: 24, maxLength: 24 }) // ObjectId tem 24 caracteres
});

// Schema para atualização de vídeo
export const updateVideoBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
  description: Type.Optional(Type.String({ minLength: 1, maxLength: 1000 })),
  url: Type.Optional(Type.String({ minLength: 1 })), // Remover format: 'uri' para aceitar URLs do YouTube
  duration: Type.Optional(Type.Number({ minimum: 0 })),
  trilhaId: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })) // ObjectId tem 24 caracteres
});

// Schema para parâmetro de ID do vídeo
export const videoIdParamSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 }) // ObjectId tem 24 caracteres
});

// Tipos TypeScript derivados dos schemas
export type CreateVideoBodyType = Static<typeof createVideoBodySchema>;
export type UpdateVideoBodyType = Static<typeof updateVideoBodySchema>;
export type VideoIdParamType = Static<typeof videoIdParamSchema>;