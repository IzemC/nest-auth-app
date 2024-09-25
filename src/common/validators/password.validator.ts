import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordValidator', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string) {
    if (!password || password.length < 8) {
      return false;
    }

    // Match any Unicode letter
    const hasLetter = /\p{L}/u.test(password);

    // Match any Unicode number
    const hasNumber = /\p{N}/u.test(password);

    // Match any special character
    const hasSpecialChar = /\p{P}|\p{S}/u.test(password);

    return hasLetter && hasNumber && hasSpecialChar;
  }

  defaultMessage() {
    return 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.';
  }
}
