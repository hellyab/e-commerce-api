import {UserService as LBUserService} from '@loopback/authentication';
import {Credentials} from '@loopback/authentication-jwt';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare, genSalt, hash} from 'bcryptjs';
import {User, UserRelations} from '../models';
import {UserRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService implements LBUserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  convertToUserProfile(user: User): UserProfile {
    if (!user) {
      throw new HttpErrors.Unauthorized(`'user' is null`);
    }

    if (!user.id) {
      throw new HttpErrors.Unauthorized(`'user id' is null`);
    }

    return {
      [securityId]: user.id.toString(),
      name: `${user.name.first} ${user.name.last}`,
      id: user.id,
      email: user.email,
    };
  }

  async createUser(user: User): Promise<User> {
    user.password = await hash(user.password, await genSalt());
    return this.userRepository.create(user);
  }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (user != null) {
      let correct = compare(credentials.password, user.password);
      if (correct) {
        return Promise.resolve(user);
      }
    }
    return Promise.reject(null);
  }
  findUserById(id: string): Promise<User & UserRelations> {
    return this.userRepository.findById(id);
  }
}
