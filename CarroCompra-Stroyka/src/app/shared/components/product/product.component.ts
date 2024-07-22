import { Component, Inject, Input, PLATFORM_ID, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { UntypedFormControl } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { RootService } from '../../services/root.service';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

// utils
import { UtilsTexto } from '../../utils/UtilsTexto';

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

    quantity: UntypedFormControl = new UntypedFormControl(1);

    addingToCart = false;
    addingToWishlist = false;
    addingToCompare = false;
    productosFavoritos = [];
    esFavorito: boolean = false;
    url: string;
    islogged
    toastOptions: Partial<IndividualConfig>= {
        timeOut: 1000,
        tapToDismiss: true,
    };

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
        localStorage.setItem('is_page_update', '1')
        this.islogged = localStorage.getItem("isLogue");
        this.cargarFavoritos();
    }

    addToCart(): void {

        if (this.storeSvc.configuracionSitio.SuperarInventario) {
            this.addingToCart = true;
            this.cart.add(this.product, this.quantity.value).subscribe({ complete: () => this.addingToCart = false });
        }
        else if (!this.addingToCart && this.product && this.quantity.value > 0 && (this.product.inventario - this.product.inventarioPedido) >= this.quantity.value) {
            this.addingToCart = true;
            this.cart.add(this.product, this.quantity.value).subscribe({ complete: () => this.addingToCart = false });
        } else {
            this.toastr.error(`Producto "${this.utils.TitleCase(this.product.name)}" no tiene suficiente inventario, disponible:${(this.product.inventario - this.product.inventarioPedido)}`, '', this.toastOptions);
        }
    }

    addToWishlist() {

        if (!this.addingToWishlist && this.product) {

            this.addingToWishlist = true;

            this.wishlist.add(this.product).then(data => {
                this.addingToWishlist = false
            });
        }
    }

    cargarFavoritos() {
        // Obtiene los favoritos del localStorage o inicializa un arreglo vacío si no hay favoritos
        this.productosFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    
        // Verifica si hay productos favoritos
        if (this.productosFavoritos.length > 0) {
    
            // Busca el índice del producto actual en la lista de favoritos
            const productIndex = this.productosFavoritos.findIndex(element => element.id === this.product?.id);
    
            // Determina si el producto es favorito (esFavorito será true si el producto existe en la lista)
            this.esFavorito = productIndex !== -1;
    
        } else {
            // Si no hay productos favoritos, establece esFavorito como false
            this.esFavorito = false;
        }
    }
    



    addToCompare(): void {
        if (!this.addingToCompare && this.product) {
            this.addingToCompare = true;

            this.compare.add(this.product).subscribe({ complete: () => this.addingToCompare = false });
        }
    }
}
