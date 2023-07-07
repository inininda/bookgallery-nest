import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { repositories } from 'src/repository/repository';
import { Auth } from 'src/auth/authorization.util';
import { JWT } from 'src/util/jwt';
@Module({
  controllers: [UsersController],
  providers: [UsersService, ...repositories, Auth, JWT],
})
export class UsersModule {}
