import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Cart, CartItem} from '../models';
import {CartRepository} from '../repositories';
import {CartService} from '../services';

export const CartItemsSchema: SchemaObject = {
  type: 'array',
  items: {
    type: 'object',
    required: ['itemId', 'quantity'],
    properties: {
      quantity: {
        type: 'number',
      },
      itemId: {
        type: 'string',
      },
    },
  },
};

export const CartItemsRequestBody = {
  description: 'The array of items to put in the cart',
  required: true,
  content: {
    'application/json': {schema: CartItemsSchema},
  },
};

@authenticate('jwt')
export class CartController {
  constructor(
    @repository(CartRepository)
    public cartRepository: CartRepository,
    @service(CartService)
    public cartService: CartService,
    @inject(SecurityBindings.USER)
    private user: UserProfile,
  ) {}

  @post('/user/cart/items', {
    responses: {
      '200': {
        description: 'Current Cart instance',
        content: {'application/json': {schema: getModelSchemaRef(Cart)}},
      },
    },
  })
  async addCartItem(
    @requestBody(CartItemsRequestBody)
    cartItems: CartItem[],
  ): Promise<Cart> {
    return this.cartService.addCartItem(cartItems, this.user.id);
  }

  @del('/user/cart/items/{id}', {
    responses: {
      '200': {
        description: 'Current Cart instance',
        content: {'application/json': {schema: getModelSchemaRef(Cart)}},
      },
    },
  })
  async removeCartItem(
    @param.path.string('itemId')
    id: string,
  ): Promise<Cart> {
    return this.cartService.removeCartItem(id, this.user.id);
  }

  @post('/user/cart', {
    responses: {
      '200': {
        description: 'Cart model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cart)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {
            title: 'NewCart',
          }),
        },
      },
    })
    cart: Cart,
  ): Promise<Cart> {
    cart.userId = this.user.id;
    return this.cartRepository.create(cart);
  }

  @get('/carts', {
    responses: {
      '200': {
        description: 'Array of Cart model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Cart, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Cart) filter?: Filter<Cart>): Promise<Cart[]> {
    return this.cartRepository.find(filter);
  }

  @patch('/carts', {
    responses: {
      '200': {
        description: 'Cart PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Cart,
    @param.where(Cart) where?: Where<Cart>,
  ): Promise<Count> {
    return this.cartRepository.updateAll(cart, where);
  }

  @get('/user/cart', {
    responses: {
      '200': {
        description: 'Cart model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cart, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findOne(
    @param.filter(Cart, {exclude: 'where'}) filter?: FilterExcludingWhere<Cart>,
  ): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      ...filter,
      where: {userId: this.user.id},
    });
  }

  @get('/carts/{id}', {
    responses: {
      '200': {
        description: 'Cart model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cart, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cart, {exclude: 'where'}) filter?: FilterExcludingWhere<Cart>,
  ): Promise<Cart> {
    return this.cartRepository.findById(id, filter);
  }

  @patch('/carts/{id}', {
    responses: {
      '204': {
        description: 'Cart PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Cart,
  ): Promise<void> {
    await this.cartRepository.updateById(id, cart);
  }

  @put('/carts/{id}', {
    responses: {
      '204': {
        description: 'Cart PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cart: Cart,
  ): Promise<void> {
    await this.cartRepository.replaceById(id, cart);
  }

  @del('/carts/{id}', {
    responses: {
      '204': {
        description: 'Cart DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cartRepository.deleteById(id);
  }
}
