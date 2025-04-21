import { IsEmail, IsObject, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  readonly username: string;

  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @IsObject()
  readonly country: object;

  @IsString()
  readonly password: string;
}
