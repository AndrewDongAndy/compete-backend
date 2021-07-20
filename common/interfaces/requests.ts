export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  ok: boolean;
  accessToken: string;
}

export interface RegisterFields {
  username: string;
  email: string;
  password: string;
  bojId: string;
  cfId: string;
}

// TODO: make these fields optional
export interface UpdateFields {
  bojId: string;
  cfId: string;
}
