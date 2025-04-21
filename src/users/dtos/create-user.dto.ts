import { IsEmail, IsObject, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

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

  @IsObject()
  readonly country: object;

  @IsString()
  readonly password: string;
}
