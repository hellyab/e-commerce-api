import {Entity, model, property} from '@loopback/repository';

@model()
export class CartItem extends Entity {
  @property({
    type: 'any',
    required: true,
    id: true,
  })
  itemId: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  constructor(data?: Partial<CartItem>) {
    super(data);
  }
}

export interface CartItemRelations {
  // describe navigational properties here
}

export type CartItemWithRelations = CartItem & CartItemRelations;
