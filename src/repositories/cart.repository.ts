import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Cart, CartRelations} from '../models';

export class CartRepository extends DefaultCrudRepository<
  Cart,
  typeof Cart.prototype.userId,
  CartRelations
> {
  constructor(@inject('datasources.Mongo') dataSource: MongoDataSource) {
    super(Cart, dataSource);
  }
}
