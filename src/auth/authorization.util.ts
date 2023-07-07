require('dotenv').config();
require('dotenv').config({ path: `./.env` });

import * as crypto from 'crypto';
import * as _ from 'lodash';
import { JWT } from 'src/util/jwt';
import { ObjectType } from 'src/util/types';
import { BusinessException } from 'src/util/BusinessException';
import { RolesConfig } from 'src/config/roles.permission';

import { User } from 'src/model/user.entity';
import { Inject } from '@nestjs/common';

const roles: any = {
  ANYONE: 'anyone',
  USER: 'user',
  ADMIN: 'admin',
};
export class Auth {
  constructor(
    private jwt: JWT,
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
  ) {}
  public signJWT(
    profileId: number,
    profileEmail: string,
    options: object | any,
  ) {
    return this.jwt.signJWT(profileId, profileEmail, options || {});
  }
  public decodeJWT(userJWT: string, options: object | any) {
    return this.jwt.decodeJWT(userJWT, options);
  }
  public async verifyJWT(userJWT: string, options: object | any) {
    return this.jwt.verifyJWT(userJWT, options);
  }
  public async verify(userJWT: string) {
    const hasBearer =
      !userJWT || ObjectType.isEmpty(userJWT)
        ? [userJWT]
        : userJWT.includes(' ')
        ? userJWT.split(' ')
        : [userJWT];
    const jwtToken = hasBearer.length === 2 ? hasBearer[1] : hasBearer[0];

    try {
      const data = await this.verifyJWT(jwtToken, null);
      return data;
    } catch (err) {
      return err;
    }
  }
  public async renewJWT(userJWT) {
    const hasBearer =
      !userJWT || ObjectType.isEmpty(userJWT)
        ? [userJWT]
        : userJWT.includes(' ')
        ? userJWT.split(' ')
        : [userJWT];
    const jwtToken = hasBearer.length === 2 ? hasBearer[1] : hasBearer[0];
    try {
      const prevJWT = await this.verify(jwtToken);
      if (!prevJWT || prevJWT instanceof Error) {
        throw prevJWT;
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // try {
        const decodedPrev = this.jwt.decodeJWT(jwtToken, {
          ignoreExpiration: true,
        });
        // check if email exists
        const checkEmail = await this.userRepository.getOne({
          email: decodedPrev.email,
        });
        console.log(checkEmail);
        if (!!decodedPrev.id) {
          // Everything works fine!
          const signParams = {
            id: decodedPrev.id,
            email: decodedPrev.email,
          };
          const jwtToken = this.signJWT(signParams.id, signParams.email, null);
          return jwtToken
            ? { state: 'renew', token: jwtToken }
            : new Error('Error signing token');
        } else {
          return new Error('Invalid JWT for unknown user');
        }
      } else {
        return new Error('Unknown renewal state');
      }
    }
  }
}
