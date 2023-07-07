import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  UsePipes,
} from '@nestjs/common';
import { JWT } from 'src/util/jwt';
import { User } from 'src/model/user.entity';
import { Auth } from './authorization.util';
import { UsersRequest, UserSignUpScheme } from 'src/users/users.request';
import { BusinessException } from 'src/util/BusinessException';
import { HttpException } from '@nestjs/common';
import { ValidationException } from 'src/util/ValidationException';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private readonly jwt: JWT,
  ) {
    this.auth = new Auth(this.jwt, User);
  }
  auth: any;

  async signUp(user: UsersRequest): Promise<any> {
    try {
      // check if email has been used
      let findUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (findUser) {
        throw new ValidationException('Email has been used', 'email');
      }
      //generate password hash
      const passwordHash = await argon.hash(user.password);
      // create new user
      const createUser = await this.userRepository.add({
        email: user.email,
        password: passwordHash,
      });

      console.log('User created : ', createUser);

      findUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      console.log('User found : ', findUser);
      if (!findUser || findUser instanceof Error) {
        throw new BusinessException('Failed to create user');
      }
      const jwtToken = await this.auth.signJWT(findUser.id, findUser.email, {});
      if (!jwtToken || jwtToken instanceof Error) {
        throw new BusinessException('Failed signing token');
      }
      return jwtToken;
    } catch (error) {
      //console.log(error);
      throw error;
    }
  }
  async signIn(user: UsersRequest): Promise<any> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!findUser || findUser instanceof Error) {
        throw new ForbiddenException('Invalid email');
      }
      const passwordMatch = await argon.verify(
        findUser.password,
        user.password,
      );
      if (!passwordMatch) {
        throw new ForbiddenException('Wrong password');
      }
      const jwtToken = await this.auth.signJWT(findUser.id, findUser.email, {});
      if (!jwtToken || jwtToken instanceof Error) {
        throw new BusinessException('Failed signing token');
      }
      return jwtToken;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
