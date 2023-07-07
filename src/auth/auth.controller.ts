import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  userScheme,
  UsersRequest,
  UserSignUpScheme,
} from 'src/users/users.request';
import { JoiValidationPipe } from 'src/config/joi-validation.pipe';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('api/signup')
  @UsePipes(new JoiValidationPipe(UserSignUpScheme))
  async signup(@Body() usersRequest: UsersRequest): Promise<any> {
    if (!usersRequest) {
      throw new BadRequestException('Validation failed');
    }
    return this.authService.signUp(usersRequest);
  }
  @Post('api/signin')
  @UsePipes(new JoiValidationPipe(userScheme))
  async signin(@Body() user: UsersRequest): Promise<any> {
    if (!user) {
      throw new BadRequestException('Validation failed');
    }
    return this.authService.signIn(user);
  }
}
