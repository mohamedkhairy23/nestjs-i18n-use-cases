import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly i18n: I18nService,
  ) {}

  async findUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('test.NOT_FOUND', {
          lang: I18nContext.current().lang,
          args: { id },
        }),
      );
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createUser = await this.userModel.create(createUserDto);
      return createUser;
    } catch (error) {
      if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyValue)[0];
        // throw new ConflictException(`${duplicatedField} already exists`);
        throw new ConflictException(
          this.i18n.t('test.ALREADY_EXISTS', {
            lang: I18nContext.current().lang,
            args: { duplicatedField },
          }),
        );
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true, runValidators: true }, // Ensure Mongoose runs schema validators
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyValue)[0];
        // throw new ConflictException(`${duplicatedField} already exists`);
        throw new ConflictException(
          this.i18n.t('test.ALREADY_EXISTS', {
            lang: I18nContext.current().lang,
            args: { duplicatedField },
          }),
        );
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('test.NOT_FOUND', {
          lang: I18nContext.current().lang,
          args: { id },
        }),
      );
    }

    await this.userModel.findByIdAndDelete(id);
  }
}
