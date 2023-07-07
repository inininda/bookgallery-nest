import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRequest } from './users.request';
import { JoiValidationPipe } from 'src/config/joi-validation.pipe';
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('api/users/me')
  async getUserActive(@Req() req: any): Promise<any> {
    return await this.usersService.getUserActive(req);
  }
}
