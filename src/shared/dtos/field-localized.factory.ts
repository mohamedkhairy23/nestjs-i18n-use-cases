import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export function createLocalizedFieldDto(fieldName: string) {
  class LocalizedFieldDto {
    @IsNotEmpty({
      message: i18nValidationMessage('validation.localizedField.ar.REQUIRED', {
        field: fieldName,
      }),
    })
    @IsString({
      message: i18nValidationMessage('validation.localizedField.ar.STRING', {
        field: fieldName,
      }),
    })
    @Transform(({ value }) => value.toString().trim())
    ar: string;

    @IsNotEmpty({
      message: i18nValidationMessage('validation.localizedField.en.REQUIRED', {
        field: fieldName,
      }),
    })
    @IsString({
      message: i18nValidationMessage('validation.localizedField.en.STRING', {
        field: fieldName,
      }),
    })
    @Transform(({ value }) => value.toString().trim())
    en: string;
  }

  return LocalizedFieldDto;
}
