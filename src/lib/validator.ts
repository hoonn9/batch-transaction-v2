import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class YYYYmmDD implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return '';
  }

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const regex = /\d{4}-\d{2}-\d{2}/gi;
    return typeof value === 'string' && regex.test(value);
  }
}
