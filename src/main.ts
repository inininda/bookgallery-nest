import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as cors from 'cors';
import * as fs from 'fs';
import * as Yaml from 'js-yaml';
import { CustomExceptionFilter } from './config/custom-exception.filter';
import { PostStatusInterceptor } from './config/post.status.interceptor';
const CORS_WL = Yaml.load(fs.readFileSync(`cors-whitelist.yml`));
async function bootstrap() {
  const instanceOptions = {
    https: null,
  };
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instanceOptions),
  );
  app.use(
    cors({
      origin: function (origin, callback) {
        if (
          !origin ||
          CORS_WL.corsModels.allowWhitelist.origins.includes(origin)
        ) {
          callback(null, true);
        } else if (CORS_WL.corsModels.allowWhitelist.origins.includes('*')) {
          callback(null, '*');
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      allowedHeaders: '*',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new PostStatusInterceptor());
  await app.listen(3333, '0.0.0.0');
}
bootstrap();
