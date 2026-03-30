export class UserEntity {
  constructor(
    public name: string,
    public email: string,
    public userId: string,
    public role: string,
    public password:string,
    public status?: boolean,
    public createdAt?: Date,
    public gender?: string,
    public age?: number,
    public googleId?: string | null,
    public phone?: string | null,    
    public address?: string | null, 
    public profilePic?:string | null
  ) {}

  public isBlocked(): boolean {
    return !this.status;
  }
}
