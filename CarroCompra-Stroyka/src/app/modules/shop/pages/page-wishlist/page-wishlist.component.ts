import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';

// modelos
import { Item } from '../../../../../data/modelos/articulos/Items';
import { StoreService } from 'src/app/shared/services/store.service';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-wishlist',
    templateUrl: './page-wishlist.component.html',
    styleUrls: ['./page-wishlist.component.scss']
})
export class PageWishlistComponent implements OnInit {
    addedToCartProducts: Item[] = [];
    removedProducts: Item[] = [];
    form: FormGroup;
    items$: Observable<Item[]>;

    constructor(
        public root: RootService,
        public wishlist: WishlistService,
        public cart: CartService,
        public storeSvc: StoreService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.items$ = this.wishlist.items$;
        this.items$.subscribe(items => {
            this.form = this.fb.group({
                items: this.fb.array(items.map(() => this.fb.control(1)))
            });
        });
    }

    addToCart(product: Item, index: number): void {
        const quantity = this.items.at(index).value;

        if (this.addedToCartProducts.includes(product)) {
            return;
        }

        this.addedToCartProducts.push(product);
        this.cart.add(product, quantity).subscribe({
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

    get maxCantidad(): (product: Item) => number {
        return (product: Item) => this.storeSvc.configuracionSitio.SuperarInventario ? Infinity : product?.inventario;
    }

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }
}
