import {BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {TokenServiceBindings} from '../keys';
import {User, UserDto} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  verifyToken(token: string): Promise<User> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    try {
      let userJSONString = jwt.verify(token, this.jwtSecret);
      return Promise.resolve(new User(JSON.parse(userJSONString.toString())));
    } catch (e) {
      throw new HttpErrors.Unauthorized(`Error verifying token : ${e.message}`);
    }
  }
  generateToken(user: UserDto): Promise<string> {
    if (!user) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : user is null',
      );
    }
    try {
      return Promise.resolve(
        jwt.sign(user, this.jwtSecret, {
          expiresIn: Number(this.jwtExpiresIn),
        }),
      );
    } catch (e) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${e.message}`);
    }
  }

  /*
   * Add service methods here
   */
}
