import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Auth } from 'src/auth/authorization.util';
import { JWT } from 'src/util/jwt';
import { User } from 'src/model/user.entity';
import { UserRoles } from 'src/model/user.roles.entity';
import { JsonWebTokenError } from 'src/util/JsonWebTokenError';
@Injectable()
export class Middleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let path = req.method + ' ' + req?.originalUrl;
    if (path === 'GET /index.html' || path.startsWith('GET /api/swagger')) {
      next();
      return;
    }
    let jwtToken = req.headers.authorization;
    let isAllowed: any = false;

    try {
      const auth = new Auth(new JWT(), User, UserRoles);
      isAllowed = await auth.allowRoles(jwtToken, path);
      req.headers['allowRoles'] = isAllowed;
    } catch (error) {
      isAllowed = error;
    }
    if (!isAllowed || isAllowed instanceof Error) {
      req.headers['allowRoles'] = null;
      next(new JsonWebTokenError(isAllowed));
    } else {
      next();
    }
  }
}
