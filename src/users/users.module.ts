import { UsersController } from './usersController';
import { UserService } from './users.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { SharedModule } from 'src/shared/shared.module';
import * as mongooseI18n from 'mongoose-i18n-localize';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(mongooseI18n, {
            locales: ['en', 'ar'],
            defaultLocale: 'en',
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
