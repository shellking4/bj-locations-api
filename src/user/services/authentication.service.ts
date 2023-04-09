import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { compareHash } from '../../commons/helpers/utils.helper';
import { SigninResponseDto } from '../dtos/response.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userservice: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async login(user: User): Promise<SigninResponseDto> {
    const userData = {
      id: user.id,
      email: user.email
    }
    const accessToken = this.jwtService.sign(userData);
    return {
      accessToken: accessToken,
      ...userData
    };
  }

  async validateUserWithEmail(email: string, password: string) {
    let user: User;
    const invalidCredentialsMessage = 'Invalid credentials !';
    try {
      user = await this.userservice.findOneByEmail(email);
    } catch (error) {
      throw new BadRequestException(invalidCredentialsMessage);
    }
    const doesMatch = await compareHash(password, user.password);
    if (doesMatch) {
      const { password, ...rest } = user;
      return rest;
    } else {
      throw new BadRequestException(invalidCredentialsMessage);
    }
  }
}
