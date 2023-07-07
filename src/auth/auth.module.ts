import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { repositories } from 'src/repository/repository';
import { JWT } from 'src/util/jwt';
import { Auth } from './authorization.util';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...repositories, Auth, JWT],
})
export class AuthModule {}
