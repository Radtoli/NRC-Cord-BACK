export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: {
    _id: string;
    name: string;
    email: string;
    roles: ('user' | 'manager')[];
    permissions: string[];
  };
  token: string;
  expiresIn: string;
}