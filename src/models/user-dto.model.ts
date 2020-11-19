import {Model, model, property} from '@loopback/repository';
import {Name} from '.';

@model()
export class UserDto extends Model {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'Name',
    required: true,
  })
  name: Name;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<UserDto>) {
    super(data);
  }
}

export interface UserDtoRelations {
  // describe navigational properties here
}

export type UserDtoWithRelations = UserDto & UserDtoRelations;
