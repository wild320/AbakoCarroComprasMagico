import { Component } from '@angular/core';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';

// modelos
import { Item } from '../../../../../data/modelos/articulos/Items';

@Component({
    selector: 'app-wishlist',
    templateUrl: './page-wishlist.component.html',
    styleUrls: ['./page-wishlist.component.scss']
})
export class PageWishlistComponent {
    constructor(
        public root: RootService,
        public wishlist: WishlistService,
        public cart: CartService
    ) { }

    addedToCartProducts: Item[] = [];
    removedProducts: Item[] = [];

    addToCart(product: Item): void {
        if (this.addedToCartProducts.includes(product)) {
            return;
        }

        this.addedToCartProducts.push(product);
        this.cart.add(product, 1).subscribe({
            complete: () => {
                this.addedToCartProducts = this.addedToCartProducts.filter(eachProduct => eachProduct !== product);
            }
        });
    }

    remove(product: Item): void {
        if (this.removedProducts.includes(product)) {
            return;
        }

        this.removedProducts.push(product);
        this.wishlist.remove(product).subscribe({
            complete: () => {
                this.removedProducts = this.removedProducts.filter(eachProduct => eachProduct !== product);
            }
        });
    }
}
