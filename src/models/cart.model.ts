import {Entity, model, property} from '@loopback/repository';
import {CartItem} from './cart-item.model';

@model()
export class Cart extends Entity {
  @property({
    type: 'string',
    generated: true,
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property.array(CartItem)
  items?: CartItem[];

  @property({
    type: 'number',
    default: 0,
  })
  totalPrice?: number;

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
