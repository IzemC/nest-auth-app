import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { SignUpDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.userService.createUser(
      signUpDto.email,
      hashedPassword,
    );
    return { message: 'User created successfully' };
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    this.logger.log(`Sign in attempt for ${signInDto.email}`);
    const user = await this.userService.findUserByEmail(signInDto.email);
    if (!user) {
      this.logger.warn(`Failed sign in attempt for ${signInDto.email}`);
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { email: user.email, sub: user._id };
    this.logger.log(`Successful sign in for ${signInDto.email}`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
