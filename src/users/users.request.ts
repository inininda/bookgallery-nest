import * as Joi from 'joi';

export const userScheme = Joi.object({
  name: Joi.string(),
  username: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.number().max(13),
  address: Joi.string(),
  gender: Joi.string(),
  dateOfBirth: Joi.date().iso(),
  image: Joi.string(),
});
export const UserSignUpScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  password_confirmation: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
});
export class UsersRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone: number;
  address: string;
  gender: string;
  dateOfBirth: Date;
  image: string;
}
