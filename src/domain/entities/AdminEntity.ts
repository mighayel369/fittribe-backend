export class AdminEntity {
  constructor(
    public name: string,
    public email: string,
    public adminId: string,
    public password?: string,
    public createdAt?: Date
  ) {}
  public canAuthenticate(): boolean {
    return !!(this.adminId && this.password);
  }
}
