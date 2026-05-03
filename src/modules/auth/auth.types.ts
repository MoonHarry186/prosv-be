export interface RegisterDto {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refresh_token: string;
}

export interface GoogleLoginDto {
  id_token: string;
}

export interface FacebookLoginDto {
  access_token: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
  created_at: Date;
}

export interface AuthResult {
  user: AuthUser;
  tokens: TokenPair;
}
