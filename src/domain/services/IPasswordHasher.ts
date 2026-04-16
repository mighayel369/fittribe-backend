
export const I_PASSWORD_HASHER_TOKEN = Symbol("I_PASSWORD_HASHER_TOKEN");
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}