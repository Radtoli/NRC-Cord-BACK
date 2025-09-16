export class UserAlreadyExistsError extends Error {
  constructor(field: string, value: string) {
    super(`User with ${field} '${value}' already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidUserDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserDataError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends Error {
  constructor(identifier?: string) {
    super(identifier ? `User with ${identifier} not found` : 'User not found');
    this.name = 'UserNotFoundError';
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Current password is incorrect');
    this.name = 'InvalidPasswordError';
  }
}