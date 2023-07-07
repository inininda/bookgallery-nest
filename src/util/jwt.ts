'use strict';

require('dotenv').config();
require('dotenv').config({ path: `./.env.` });

import * as crypto from 'crypto';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ObjectType } from './types';

@Injectable()
export class JWT {
  constructor() {}

  signJWT(userId: number, userEmail: string, options: any) {
    const jwtSecret = Buffer.from(process.env.JWT_SECRET, 'base64');
    const jwtExpire = parseInt(process.env.JWT_EXPIRE);
    const expiredAt = new Date(Date.now() + jwtExpire * 1000);
    const nonce = crypto
      .createHash('sha256', jwtSecret)
      .update(Date.now().toString())
      .digest('hex');
    const signHash = crypto
      .createHash('sha256', jwtSecret)
      .update(`${userId}${userEmail}${process.env.JWT_SECRET}`)
      .digest('hex');

    try {
      return jwt.sign(
        {
          id: userId,
          email: userEmail,
          _nonce: nonce,
          _hash: signHash,
        },
        jwtSecret,
        _.merge(
          {
            algorithm: 'HS256',
            expiresIn: parseInt(process.env.JWT_EXPIRE),
          },
          ObjectType.expect(options, Object) ? options : {},
        ),
      );
    } catch (e) {
      return e;
    }
  }
  decodeJWT(jwtToken: string, options: any) {
    const jwtSecret = Buffer.from(process.env.JWT_SECRET, 'base64');
    try {
      return jwt.verify(
        jwtToken,
        jwtSecret,
        _.merge({ algorithm: 'HS256' }, options),
      );
    } catch (error) {
      return error;
    }
  }
  async verifyJWT(jwtToken: string, options: any) {
    if (!jwtToken || jwtToken === '') {
      throw new Error('Invalid JWT Token');
    }
    const decoded = await this.decodeJWT(jwtToken, options);
    if (!decoded || decoded instanceof Error) {
      throw new Error('Invalid JWT Token');
    }
    if (!decoded._nonce) {
      throw new Error('Undefined JWT nonce');
    }
    if (!decoded._hash) {
      throw new Error('Undefined JWT hash');
    }

    const schema = Joi.object({
      id: Joi.alternatives([
        Joi.number().integer(),
        Joi.string()
          .allow(null)
          .pattern(new RegExp(/^[0-9]{18}$/)),
      ]).required(),
      email: Joi.string().required(),
      _nonce: Joi.string().required(),
      _hash: Joi.string().required(),
      iat: Joi.alternatives([
        Joi.number().integer(),
        Joi.string()
          .allow(null)
          .pattern(new RegExp(/^[0-9]{18}$/)),
      ]).required(),
      exp: Joi.alternatives([
        Joi.number().integer(),
        Joi.string()
          .allow(null)
          .pattern(new RegExp(/^[0-9]{18}$/)),
      ]).required(),
    });
    let validJWT;
    try {
      validJWT = await schema.validateAsync(decoded);
    } catch (err) {
      return err;
    }
    if (validJWT.exp > Math.floor(Date.now() / 1000)) {
      const signParams = {
        profileId: validJWT.id,
        profileEmail: validJWT.email,
      };
      const newJwtToken = this.signJWT(signParams.profileId, signParams.profileEmail, options);
      const newJwtCred = this.decodeJWT(newJwtToken, options);
      return newJwtToken
        ? { token: newJwtToken, credentials: newJwtCred, state: 'renew' }
        : new Error('Error signing token');
    }

    return !validJWT || validJWT instanceof Error
      ? validJWT
      : validJWT._hash
      ? { state: 'valid', credentials: validJWT }
      : new Error('Invalid JWT');
  }
}
