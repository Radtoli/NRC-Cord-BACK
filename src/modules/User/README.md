# User API Documentation

## Rotas Implementadas

### 1. Login de Usuário
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@exemplo.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "ObjectId",
      "name": "João Silva",
      "email": "user@exemplo.com",
      "roles": ["user"],
      "permissions": ["read:profile"]
    },
    "token": "jwt-token-here",
    "expiresIn": "7d"
  },
  "message": "Login successful"
}
```

### 2. Criar Usuário (Apenas Administradores)
**POST** `/users`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Body:**
```json
{
  "name": "Novo Usuário",
  "email": "novo@exemplo.com",
  "password": "senha123",
  "demolayId": 12345,
  "roles": ["user"],
  "permissions": ["read:profile"]
}
```

### 3. Trocar Senha
**PATCH** `/auth/change-password`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Body:**
```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456"
}
```

### 4. Atualizar Usuário (Apenas Administradores)
**PUT** `/users/:id`

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Body:**
```json
{
  "name": "Nome Atualizado",
  "email": "email@atualizado.com",
  "status": "active",
  "roles": ["manager"]
}
```

## Permissões e Roles

### Roles Disponíveis:
- `user`: Usuário comum
- `manager`: Administrador com acesso total

### Restrições:
- **Login**: Público (sem autenticação)
- **Trocar senha**: Requer autenticação (qualquer usuário logado)
- **Criar usuário**: Requer role `manager`
- **Atualizar usuário**: Requer role `manager`

## Códigos de Erro

- **400**: Dados inválidos
- **401**: Não autenticado ou credenciais inválidas
- **403**: Sem permissão (role insuficiente)
- **404**: Usuário não encontrado
- **409**: Conflito (email ou demolayId já existe)
- **500**: Erro interno do servidor

## Variáveis de Ambiente Necessárias

```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```