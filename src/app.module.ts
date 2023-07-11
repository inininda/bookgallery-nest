import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Middleware } from './config/middleware';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/database.module';
import { APP_FILTER } from '@nestjs/core';
import { UserRolesModule } from './user_roles/user_roles.module';

const importModule = [
  ConfigModule.forRoot({
    envFilePath: `.env`,
    isGlobal: true,
  }),
  UsersModule,
  AuthModule,
  DatabaseModule,
];
@Module({
  imports: importModule,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(Middleware).forRoutes('*');
  }
}
