import { User } from '../user/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}
