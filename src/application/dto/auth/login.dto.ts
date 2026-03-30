export interface LoginRequestDTO{
    email:string,
    password:string
}

export interface AuthUser{
  id:string,
  name:string,
  email:string
}
export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  role: string;
  user:AuthUser
}