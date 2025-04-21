import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './mongo/mongo.module';
import * as path from 'path';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
} from 'nestjs-i18n';
import { CustomI18nService } from './shared/custom-i18n.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en', // default lang
      loaderOptions: {
        // loading translation files
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        // Header => x-lang=ar (OR) Accept-Language = ar
        // Query ? lang=en
        // Cookie => lang=ar
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
      ],
    }),
    UsersModule,
    MongoModule,
    SharedModule,
  ],
  providers: [CustomI18nService],
})
export class AppModule {}
