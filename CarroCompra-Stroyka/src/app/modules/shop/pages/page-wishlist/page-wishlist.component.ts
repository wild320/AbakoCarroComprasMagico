import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';
import { WishlistService } from '../../../../shared/services/wishlist.service';

// modelos
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StoreService } from 'src/app/shared/services/store.service';
import { UtilsTexto } from 'src/app/shared/utils/UtilsTexto';
import { Item } from '../../../../../data/modelos/articulos/Items';

@Component({
    selector: 'app-wishlist',
    templateUrl: './page-wishlist.component.html',
    styleUrls: ['./page-wishlist.component.scss']
})
export class PageWishlistComponent implements OnInit {
    addedToCartProducts: Item[] = [];
    removedProducts: Item[] = [];
    form: UntypedFormGroup;
    items$: Observable<Item[]>;
    cantOutStock: boolean = true;

    constructor(
        public root: RootService,
        public wishlist: WishlistService,
        public cart: CartService,
        public storeSvc: StoreService,
        private fb: UntypedFormBuilder,
        private toastr: ToastrService,
        private utils: UtilsTexto,

    ) {
        this.cantOutStock = this.storeSvc.configuracionSitio.SuperarInventario;
    }

    ngOnInit() {
        this.items$ = this.wishlist.items$;
        this.items$.subscribe(items => {
            // Initialize the form with controls based on items
            this.form = this.fb.group({
                items: this.fb.array(items.map(item => this.createItemControl(item))) // Create controls for each item
            });
        });
    }

    createItemControl(item: Item): UntypedFormGroup {
        return this.fb.group({
            quantity: [1, [Validators.required, Validators.min(1), Validators.max(item.inventario)]], // Set initial value and validations
        });
    }


    addToCart(product: Item, index: number): void {
        const quantity = this.getQuantityControl(index).value;

        if (this.addedToCartProducts.includes(product)) {
            return;
        }

        if (!this.cantOutStock && quantity > product.inventario) {
            const stockAvailable = (product.inventario - product.inventarioPedido)
            this.toastr.error(`Producto "${this.utils.TitleCase(product.name)}" no tiene suficiente inventario, disponible:${stockAvailable}`);
            this.items.at(index).setValue(stockAvailable);
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

    getQuantityControl(index: number): FormControl {
        return this.items.at(index).get('quantity') as FormControl;
    }

}
