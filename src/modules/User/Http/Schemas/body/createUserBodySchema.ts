import { Static, Type } from "@sinclair/typebox";

export const createUserBodySchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
  demolayId: Type.Number(),
  roles: Type.Optional(Type.Array(Type.Union([Type.Literal("user"), Type.Literal("manager"), Type.Literal("corretor")]))),
  permissions: Type.Optional(Type.Array(Type.String())),
  settings: Type.Optional(
    Type.Object({
      theme: Type.Union([Type.Literal("light"), Type.Literal("dark")], { default: "light" }),
      language: Type.String({ minLength: 2, default: "pt-BR" })
    })
  )
});

export type CreateUserBodyType = Static<typeof createUserBodySchema>;