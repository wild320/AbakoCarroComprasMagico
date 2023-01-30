import { Component, Inject, Input, PLATFORM_ID , OnInit} from '@angular/core';
import { Product } from '../../interfaces/product';
import { FormControl } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { RootService } from '../../services/root.service';
import { ToastrService } from 'ngx-toastr';

// utils
import {UtilsTexto} from '../../utils/UtilsTexto';

// modelos
import { Item } from '../../../../data/modelos/articulos/Items';

export type ProductLayout = 'standard' | 'sidebar' | 'columnar' | 'quickview';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    @Input() layout: ProductLayout;

    @Input() product: Item;

    quantity: FormControl = new FormControl(1);

    addingToCart = false;
    addingToWishlist = false;
    addingToCompare = false;
    url: string;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private cart: CartService,
        private wishlist: WishlistService,
        private compare: CompareService,
        public root: RootService,
        private toastr: ToastrService,
        private utils: UtilsTexto,
    ) { 
       
     }

    ngOnInit(): void {
        localStorage.setItem('is_page_update','1')

    }

    addToCart(): void {
    
    
        if (!this.addingToCart && this.product && this.quantity.value > 0 && this.product.inventario >= this.quantity.value  ) {
            this.addingToCart = true;
            this.cart.add(this.product, this.quantity.value).subscribe({complete: () => this.addingToCart = false});
        }else{
            this.toastr.error(`Producto "${this.utils.TitleCase (this.product.name) }" no tiene suficiente inventario, disponible:${ (this.product.inventario) }`);
        }
    }

    addToWishlist(): void {
        if (!this.addingToWishlist && this.product) {
            this.addingToWishlist = true;

            this.wishlist.add(this.product).subscribe({complete: () => this.addingToWishlist = false});
        }
    }

    addToCompare(): void {
        if (!this.addingToCompare && this.product) {
            this.addingToCompare = true;

            this.compare.add(this.product).subscribe({complete: () => this.addingToCompare = false});
        }
    }
}
