// src/users/dtos/create-user.dto.ts
import {
  IsDefined,
  IsEmail,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { createLocalizedFieldDto } from 'src/shared/dtos/field-localized.factory';

const CountryDto = createLocalizedFieldDto('');

export class CreateUserDto {
  @IsString()
  @Length(3, 20, {
    message: i18nValidationMessage('validation.USER_STRING_LENGTH'),
  })
  readonly username: string;

  @IsEmail(
    {},
    { message: i18nValidationMessage('validation.EMAIL_NOT_FORMATTED') },
  )
  readonly email: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => CountryDto)
  readonly country: InstanceType<typeof CountryDto>;

  @IsString()
  readonly password: string;
}
