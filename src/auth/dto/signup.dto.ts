import { IsEmail, IsString, Validate } from 'class-validator';
import { PasswordValidator } from '../../common/validators/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123@',
    description:
      'Password must be at least 8 characters long and contain at least one letter, one number, and one special character.',
  })
  @IsString()
  @Validate(PasswordValidator)
  password: string;
}
