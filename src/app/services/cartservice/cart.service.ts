import { Injectable } from '@angular/core';
import { CartItem, Product } from 'src/Interfaces/Interfaces';
// Update the import path

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartTotal: number = 0;
  private cartid!: number;

  constructor() { }
 
  //Adds Product Into Cart
  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Product already exists in the cart, increase the quantity
      existingItem.quantity++;
    } else {
      // Product doesn't exist in the cart, add it as a new cart item
      this.cartItems.push({
        product, quantity: 1,
        id:1,
      });
    }

    this.updateCartTotal();
    console.log(this.cartItems);
  }

  removeFromCart(product: Product): void {
    const index = this.cartItems.findIndex(item => item.product.id === product.id);

    if (index !== -1) {
      const item = this.cartItems[index];
      if (item.quantity > 1) {
        // If quantity is greater than 1, decrease the quantity
        item.quantity--;
      } else {
        // If quantity is 1, remove the item from the cart
        this.cartItems.splice(index, 1);
      }
    }

    this.updateCartTotal();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartTotal(): number {
    return this.cartTotal;
  }
  
  private calculateSubtotal(cartItem: CartItem): number {
    return cartItem.product.price * cartItem.quantity;
  }

  private updateCartTotal(): void {
    let total = 0;
    for (const cartItem of this.cartItems) {
      const subtotal = this.calculateSubtotal(cartItem);
      total += subtotal;
    }
    this.cartTotal = total;
  }
  generateCartId(){
    this.cartid=Math.floor(Math.random()+1)
    return this.cartid
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartTotal = 0;
  }
}