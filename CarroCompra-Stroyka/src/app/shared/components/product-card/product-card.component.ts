import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductAttribute } from '../../interfaces/product';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { QuickviewService } from '../../services/quickview.service';
import { RootService } from '../../services/root.service';
import { CurrencyService } from '../../services/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// modelos
import { Item } from '../../../../data/modelos/articulos/Items';
import { StoreService } from '../../services/store.service';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent implements OnInit, OnDestroy, OnChanges {
    private destroy$: Subject<void> = new Subject();

    @Input() product: Item;
    @Input() layout: 'grid-sm'|'grid-nl'|'grid-lg'|'list'|'horizontal'|null = null;

    addingToCart = false;
    addingToWishlist = false;
    addingToCompare = false;
    showingQuickview = false;
    productosFavoritos = [];
    esFavorito : boolean = false;
    featuredAttributes: ProductAttribute[] = [];
    quick

    constructor(
        private cd: ChangeDetectorRef,
        public root: RootService,
        public cart: CartService,
        public wishlist: WishlistService,
        public compare: CompareService,
        public quickview: QuickviewService,
        public currency: CurrencyService,
        public storeSvc: StoreService,
    ) { }

    ngOnInit(): void {
        // tslint:disable-next-line: deprecation
        this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.cd.markForCheck();
           
        });

        this.cargarFavoritos();
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

        this.addingToCart = true;
        // tslint:disable-next-line: deprecation
        // tslint:disable-next-line: deprecation
        this.cart.add(this.product, 1).subscribe({
            complete: () => {
                this.addingToCart = false;
                this.cd.markForCheck();
            }
        });
    }

    addToWishlist() {
        this.esFavorito = true;
        if (!this.addingToWishlist && this.product) {

                this.wishlist.add(this.product).then((data: any)=>{
                if(data){
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
        this.compare.add(this.product).subscribe({
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
         this.quickview.show(this.product).subscribe({
            complete: () => {
                this.showingQuickview = false;
                this.cd.markForCheck();
            }
        });
    }


    cargarFavoritos(){
     this.productosFavoritos= JSON.parse(localStorage.getItem("favoritos")) 
     const product =  this.productosFavoritos?.findIndex(element =>  element.id ===  this.product.id) 
     this.esFavorito = product != -1 
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
