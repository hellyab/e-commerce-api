import {BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';
import {User, UserDto} from '../models';
const jwt = require('jsonwebtoken');
const verifyAsync = promisify(jwt.verify);

@injectable({scope: BindingScope.TRANSIENT})
export class TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async verifyToken(token: string): Promise<User> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    try {
      let user: User = await verifyAsync(token, this.jwtSecret);
      return Promise.resolve(user);
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
      const token = jwt.sign(user, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });

      return Promise.resolve(token);
    } catch (e) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${e.message}`);
    }
  }

  /*
   * Add service methods here
   */
}
