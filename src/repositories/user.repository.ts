import {UserCredentials} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.Mongo') dataSource: MongoDataSource) {
    super(User, dataSource);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    const user = await this.findById(userId);
    if (user != null) {
      return Promise.resolve(
        new UserCredentials({
          userId: user.id,
          password: user.password,
          email: user.email,
        }),
      );
    }
  }
}
