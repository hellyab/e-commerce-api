import {service} from '@loopback/core';
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
} from '@loopback/rest';
import {Cart, CartItem} from '../models';
import {CartRepository} from '../repositories';
import {CartService} from '../services';

export class CartController {
  constructor(
    @repository(CartRepository)
    public cartRepository: CartRepository,
    @service(CartService)
    public cartService: CartService,
  ) {}

  @post('/cart/{userId}/add', {
    responses: {
      '200': {
        description: 'Current Cart instance',
        content: {'application/json': {schema: getModelSchemaRef(Cart)}},
      },
    },
  })
  async addCartItem(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(CartItem, {includeRelations: true}),
          },
        },
      },
    })
    cartItems: CartItem[],
    @param.path.string('userId')
    userId: string,
  ): Promise<Cart> {
    return this.cartService.addCartItem(cartItems, userId);
  }

  @post('/cart', {
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
    return this.cartRepository.create(cart);
  }

  @get('/cart', {
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

  @patch('/cart', {
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

  @get('/cart/{id}', {
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

  @patch('/cart/{id}', {
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

  @put('/cart/{id}', {
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

  @del('/cart/{id}', {
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
