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
import { CustomI18nService } from 'src/shared/custom-i18n.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly i18n: CustomI18nService,
  ) {}

  async findUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(
        this.i18n.translate('test.NOT_FOUND', {
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
          this.i18n.translate('test.ALREADY_EXISTS', {
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
        const msg = this.i18n.translate('test.NOT_FOUND', {
          args: { id },
        });
        throw new NotFoundException(msg);
      }

      return updatedUser;
    } catch (error) {
      if (error.name === 'CastError') {
        const msg = this.i18n.translate('test.NOT_FOUND', {
          args: { id },
        });
        throw new NotFoundException(msg);
      }
      if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyValue)[0];
        throw new ConflictException(
          this.i18n.translate('test.ALREADY_EXISTS', {
            args: { duplicatedField },
          }),
        );
      }
      const fallbackMsg = this.i18n.translate('test.UNEXPECTED_ERROR');
      throw new InternalServerErrorException(fallbackMsg);
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(
        this.i18n.translate('test.NOT_FOUND', {
          args: { id },
        }),
      );
    }

    await this.userModel.findByIdAndDelete(id);
  }
}
