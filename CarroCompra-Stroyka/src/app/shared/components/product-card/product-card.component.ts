import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product, ProductAttribute } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';
import { CompareService } from '../../services/compare.service';
import { CurrencyService } from '../../services/currency.service';
import { QuickviewService } from '../../services/quickview.service';
import { RootService } from '../../services/root.service';
import { WishlistService } from '../../services/wishlist.service';

// modelos
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Item } from '../../../../data/modelos/articulos/Items';
import { StoreService } from '../../services/store.service';
import { UtilsTexto } from '../../utils/UtilsTexto';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent implements OnInit, OnDestroy, OnChanges {
    private destroy$: Subject<void> = new Subject();

    @Input() product: Item | Product;
    @Input() layout: 'grid-sm' | 'grid-nl' | 'grid-lg' | 'list' | 'horizontal' | null = null;

    addingToCart = false;
    addingToWishlist = false;
    addingToCompare = false;
    showingQuickview = false;
    productosFavoritos = [];
    esFavorito: boolean = false;
    featuredAttributes: ProductAttribute[] = [];
    quick
    islogged
    quantity: number = 1;
    cantOutStock: boolean = true;


    toastOptions: Partial<IndividualConfig> = {
        timeOut: 1000,
        tapToDismiss: true,
    };

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private cd: ChangeDetectorRef,
        public root: RootService,
        public cart: CartService,
        public wishlist: WishlistService,
        public compare: CompareService,
        public quickview: QuickviewService,
        public currency: CurrencyService,
        public storeSvc: StoreService,
        private toastr: ToastrService,
        private utils: UtilsTexto,
    ) {
        if(isPlatformBrowser(this.platformId)){
            this.cantOutStock = this.storeSvc.configuracionSitio.SuperarInventario;
        }

    }

    ngOnInit(): void {
        if(isPlatformBrowser(this.platformId)){

            this.islogged = localStorage.getItem("isLogue");
            // tslint:disable-next-line: deprecation
            this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.cd.markForCheck();
                
            });
            
            this.cargarFavoritos();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('product' in changes) {
            // this.featuredAttributes = !this.product ? [] : this.product.attributes?.filter(x => x.featured);
        }
    }

    addToCart(): void {
        if (this.addingToCart) {
            return;
        }

        if (!this.cantOutStock && this.quantity > this.product['inventario']) {
            const stockAvailable = (this.product['inventario'] - this.product['inventarioPedido'])
            this.toastr.error(`Producto "${this.utils.TitleCase(this.product.name)}" no tiene suficiente inventario, disponible:${stockAvailable}`, '', this.toastOptions);
            this.quantity = stockAvailable;
            return;
        }

        this.addingToCart = true;
        // tslint:disable-next-line: deprecation
        // tslint:disable-next-line: deprecation
        this.cart.add(this.product as Item, this.quantity).subscribe({
            complete: () => {
                this.addingToCart = false;
                this.cd.markForCheck();
            }
        });
    }

    addToWishlist() {
        this.esFavorito = true;
        if (!this.addingToWishlist && this.product) {

            this.wishlist.add(this.product as Item).then((data: any) => {
                if (data) {
                    this.addingToWishlist = false
                }
            });


        }
    }

    addToCompare(): void {
        if (this.addingToCompare) {
            return;
        }

        this.addingToCompare = true;
        // tslint:disable-next-line: deprecation
        this.compare.add(this.product as Item).subscribe({
            complete: () => {
                this.addingToCompare = false;
                this.cd.markForCheck();
            }
        });
    }

    showQuickview(): void {
        if (this.showingQuickview) {
            return;
        }

        this.showingQuickview = true;
        // tslint:disable-next-line: deprecation
        this.quickview.show(this.product as Item).subscribe({
            complete: () => {
                this.showingQuickview = false;
                this.cd.markForCheck();
            }
        });
    }


    cargarFavoritos() {
        this.productosFavoritos = JSON.parse(localStorage.getItem("favoritos"))
        const product = this.productosFavoritos?.findIndex(element => element.id === this.product.id)
        this.esFavorito = product != -1
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get maxCantidad(): (product: any) => number {
        return (product: Item) => this.storeSvc.configuracionSitio.SuperarInventario ? Infinity : product?.inventario;
    }

}
