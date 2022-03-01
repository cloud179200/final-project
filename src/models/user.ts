export interface AuthToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface IUser {
  profile_id: string;
  login: string;
  firstName?: string;
  lastName?: string;
  dateOfLoginAttempt?: string;
  countOfLoginAttempts?: string;
  forceChangePassword?: string;
  token: string;
}
