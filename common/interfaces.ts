export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  ok: boolean;
  accessToken: string;
}

export interface Problem {
  title: string;
  tier: number;
  solved: boolean;
}
