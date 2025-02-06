import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { CompareService } from '../../services/compare.service';
import { RootService } from '../../services/root.service';
import { WishlistService } from '../../services/wishlist.service';

// utils
import { UtilsTexto } from '../../utils/UtilsTexto';

// modelos
import { Item } from '../../../../data/modelos/articulos/Items';
import { StoreService } from '../../services/store.service';
import { isPlatformBrowser } from '@angular/common';



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
    toastOptions: Partial<IndividualConfig> = {
        timeOut: 1000,
        tapToDismiss: true,
    };

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
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
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('is_page_update', '1')
            this.islogged = localStorage.getItem("isLogue");
            this.cargarFavoritos();
        }
    }

    addToCart(): void {
        const availableStock = this.product.inventario - this.product.inventarioPedido;
        const requestedQuantity = this.quantity.value;

        // If already adding to cart, prevent further actions
        if (this.addingToCart) {
            return;
        }

        // Check if the product can be added based on stock policy
        if (this.storeSvc.configuracionSitio.SuperarInventario || (requestedQuantity > 0 && requestedQuantity <= availableStock)) {
            this.addingToCart = true;
            this.cart.add(this.product, requestedQuantity).subscribe({
                complete: () => this.addingToCart = false
            });
        } else {
            this.quantity.setValue(availableStock);
            this.toastr.error(
                `Producto "${this.utils.TitleCase(this.product.name)}" no tiene suficiente inventario, disponible: ${availableStock}`,
                '',
                this.toastOptions
            );
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
        if (isPlatformBrowser(this.platformId)) {
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
        }}
    }




    addToCompare(): void {
        if (!this.addingToCompare && this.product) {
            this.addingToCompare = true;

            this.compare.add(this.product).subscribe({ complete: () => this.addingToCompare = false });
        }
    }

    get available(): boolean {
        const isAvailable = (this.product.availability !== 'No Disponible' && this.product.inventario - this.product.inventarioPedido < 1 && !this.storeSvc.configuracionSitio.SuperarInventario) || (this.product.availability === 'No Disponible' && !this.storeSvc.configuracionSitio.SuperarInventario);
        return isAvailable;
    }
}
