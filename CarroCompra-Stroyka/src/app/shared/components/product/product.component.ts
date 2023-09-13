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
import { StoreService } from '../../services/store.service';



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
    productosFavoritos = [];
    esFavorito : boolean = false;
    url: string;
    islogged

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private cart: CartService,
        private wishlist: WishlistService,
        private compare: CompareService,
        public root: RootService,
        private toastr: ToastrService,
        private utils: UtilsTexto,
        public storeSvc: StoreService,
    ) {

     }

    ngOnInit(): void {
        localStorage.setItem('is_page_update','1')
        this.islogged = localStorage.getItem("isLogue");
        this.cargarFavoritos();

    }

    addToCart(): void {

        if(this.storeSvc.configuracionSitio.SuperarInventario){
            this.addingToCart = true;
            this.cart.add(this.product, this.quantity.value).subscribe({complete: () => this.addingToCart = false});
        }
         else if(!this.addingToCart && this.product && this.quantity.value > 0 && (this.product.inventario - this.product.inventarioPedido) >= this.quantity.value) {
            this.addingToCart = true;
            this.cart.add(this.product, this.quantity.value).subscribe({complete: () => this.addingToCart = false});
        }else{
            this.toastr.error(`Producto "${this.utils.TitleCase (this.product.name) }" no tiene suficiente inventario, disponible:${  (this.product.inventario - this.product.inventarioPedido) }`);
        }
    }

    addToWishlist() {
        this.esFavorito = true;
        if (!this.addingToWishlist && this.product) {
            this.addingToWishlist = true;

                this.wishlist.add(this.product).then(data=>{
                    this.addingToWishlist = false

                });


        }
    }

    cargarFavoritos(){
        this.productosFavoritos= JSON.parse(localStorage.getItem("favoritos"))
        const product =  this.productosFavoritos.findIndex(element =>  element.id ===  this.product?.id)
        this.esFavorito = product != -1
       }


    addToCompare(): void {
        if (!this.addingToCompare && this.product) {
            this.addingToCompare = true;

            this.compare.add(this.product).subscribe({complete: () => this.addingToCompare = false});
        }
    }
}
