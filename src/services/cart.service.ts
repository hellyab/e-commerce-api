import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Cart, CartItem} from '../models';
import {CartRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class CartService {
  constructor(
    @repository(CartRepository)
    private cartRepository: CartRepository,
  ) {}

  addCartItem = async (
    cartItems: CartItem[],
    userId: string,
  ): Promise<Cart> => {
    let cart = await this.cartRepository.findOne({
      where: {
        userId: userId,
      },
    });

    //TODO: fix the time complexity here

    if (cart != null) {
      [...cartItems].forEach(cartItem => {
        if (!cart?.items?.some(item => item.itemId == cartItem?.itemId)) {
          cart?.items?.push(cartItem);
        } else {
          cart?.items?.forEach(item => {
            if (item.itemId == cartItem.itemId) {
              item.quantity += cartItem.quantity;
            }
          });
        }
      });
      await this.cartRepository.update(cart);
      return Promise.resolve(cart);
    } else {
      return await this.cartRepository.create({
        items: cartItems,
        userId: userId,
        totalPrice: 0,
      });
    }
  };

  /*
   * Add service methods here
   */
}
