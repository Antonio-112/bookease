import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepository } from '../../../domain/user/interfaces/user.repository';
import { User } from '../../../domain/user/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private mapToUserEntity(doc: any): User {
    if (!doc) {
      return null;
    }
    return new User(doc._id, doc.name, doc.email, doc.password);
  }

  async create(user: User): Promise<User> {
    this.logger.debug('Creating a new user');
    const newUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    const savedDoc = await newUser.save();
    return this.mapToUserEntity(savedDoc);
  }

  async findByName(name: string): Promise<User | null> {
    this.logger.debug(`Finding user by name: ${name}`);
    const doc = await this.userModel.findOne({ name }).exec();
    return this.mapToUserEntity(doc);
  }

  async findAll(): Promise<User[]> {
    this.logger.debug('Finding all users');
    const docs = await this.userModel.find().exec();
    return docs.map(this.mapToUserEntity);
  }

  async findById(id: string): Promise<User | null> {
    this.logger.debug(`Finding user by id: ${id}`);
    const doc = await this.userModel.findById(id).exec();
    return this.mapToUserEntity(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Finding user by email: ${email}`);
    const doc = await this.userModel.findOne({ email }).exec();
    return this.mapToUserEntity(doc);
  }

  async update(id: string, user: User): Promise<User | null> {
    this.logger.debug(`Updating user with id: ${id}`);
    const updatedUser = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    const doc = await this.userModel
      .findByIdAndUpdate(id, updatedUser, { new: true })
      .exec();
    return this.mapToUserEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    this.logger.debug(`Deleting user with id: ${id}`);
    const { deletedCount } = await this.userModel.deleteOne({ _id: id }).exec();
    return deletedCount > 0;
  }

  async count(): Promise<number> {
    this.logger.debug('Counting total users');
    return this.userModel.countDocuments().exec();
  }

  async findByPartialName(partialName: string): Promise<User[]> {
    this.logger.debug(`Finding users with partial name: ${partialName}`);
    const docs = await this.userModel
      .find({ name: { $regex: partialName, $options: 'i' } })
      .exec();
    return docs.map(this.mapToUserEntity);
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    this.logger.debug(`Updating password for user with id: ${id}`);
    const updateResult = await this.userModel
      .updateOne({ _id: id }, { password: newPassword })
      .exec();
    this.logger.debug('updated result count: ' + updateResult.modifiedCount);
    return updateResult.modifiedCount > 0;
  }
}
