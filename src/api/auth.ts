import { http } from "./http";

export type AuthResponse = {
  access_token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  fullName: string;
  email: string;
  password: string;
};

export const authApi = {
  login: (dto: LoginDto) =>
    http<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  register: (dto: RegisterDto) =>
    http<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  profile: () => http<any>("/auth/profile"),
};
