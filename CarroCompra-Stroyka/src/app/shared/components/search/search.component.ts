import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    Component,
    ElementRef, EventEmitter,
    HostBinding,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit, Output,
    PLATFORM_ID,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Category } from '../../interfaces/category';
import { CartService } from '../../services/cart.service';
import { RootService } from '../../services/root.service';

// utils
import { UtilsTexto } from '../../utils/UtilsTexto';

// modelos
import { Item } from '../../../../data/modelos/articulos/Items';

// Servicios
import { ArticulosService } from '../../../shared/services/articulos.service';
import { StoreService } from '../../services/store.service';
import { UsuarioService } from '../../services/usuario.service';

export type SearchLocation = 'header' | 'indicator' | 'mobile-header';

export type CategoryWithDepth = Category & { depth: number };

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    exportAs: 'search',
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    form: UntypedFormGroup;

    p: number = 1;

    public pagina = 1;
    accUPagination = 0

    public optionPagination: any = {
        total: 0,
        page: 1,
        totalPage: 0,
        pageSize: 5,
        pageArr: [],
        first: 0,
        last: 4,
        max_page: 5,
    };

    hasSuggestions = false;

    suggestedProducts: Item[] = [];

    addedToCartProducts: Item[] = [];


    quantity: UntypedFormControl = new UntypedFormControl(1);

    @Input() location: SearchLocation;

    @Output() escape: EventEmitter<void> = new EventEmitter<void>();

    @Output() closeButtonClick: EventEmitter<void> = new EventEmitter<void>();

    @HostBinding('class.search') classSearch = true;

    @HostBinding('class.search--location--header') get classSearchLocationHeader(): boolean { return this.location === 'header'; }

    @HostBinding('class.search--location--indicator') get classSearchLocationIndicator(): boolean { return this.location === 'indicator'; }

    @HostBinding('class.search--location--mobile-header') get classSearchLocationMobileHeader(): boolean { return this.location === 'mobile-header'; }

    @HostBinding('class.search--has-suggestions') get classSearchHasSuggestions(): boolean { return this.hasSuggestions; }

    @HostBinding('class.search--suggestions-open') classSearchSuggestionsOpen = false;

    @ViewChild('input') inputElementRef: ElementRef;

    get element(): HTMLElement { return this.elementRef.nativeElement; }

    get inputElement(): HTMLElement { return this.inputElementRef.nativeElement; }
    
    public islogged: boolean = false;

    private usuarioLogueadoSubscription: Subscription;

    constructor(
        @Inject(DOCUMENT) private document: Document,        
        @Inject(PLATFORM_ID) private platformId: Object,
        private fb: UntypedFormBuilder,
        private elementRef: ElementRef,
        private zone: NgZone,
        private cart: CartService,
        public root: RootService,
        public articulossvc: ArticulosService,
        private toastr: ToastrService,
        private utils: UtilsTexto,
        public StoreSvc: StoreService,        
        private usuarioService: UsuarioService
    ) {
        this.cargarSugerencias();
        
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngOnInit(): void {
        this.form = this.fb.group({
            query: [''],
        });


        this.form.get('query').valueChanges.subscribe(query => {


            if (query.length > 3) {

                this.articulossvc.RecuperarArticulosBusqueda(query)

                if (!this.articulossvc.SuscribirBusquedaArticulos) {
                    this.suscribirBusqueda();
                }

            }

        });

        this.zone.runOutsideAngular(() => {
            fromEvent(this.document, 'click').pipe(
                takeUntil(this.destroy$),
            ).subscribe(event => {

                const activeElement = this.document.activeElement;

                // If the inner element still has focus, ignore the click.
                if (activeElement && activeElement.closest('.search') === this.element) {
                    return;
                }

                // Close suggestion if click performed outside of component.
                if (event.target instanceof HTMLElement && this.element !== event.target.closest('.search')) {
                    this.zone.run(() => this.closeSuggestion());
                }
            });

            fromEvent(this.element, 'focusout').pipe(
                debounceTime(10),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                if (this.document.activeElement === this.document.body) {
                    return;
                }

                // Close suggestions if the focus received an external element.
                if (this.document.activeElement && this.document.activeElement.closest('.search') !== this.element) {
                    this.zone.run(() => this.closeSuggestion());
                }
            });
        });
        
        this.updateIsLogged();
        if (isPlatformBrowser(this.platformId)) {
        // Suscribirse a los cambios en el estado de inicio de sesión
        this.usuarioLogueadoSubscription = this.usuarioService.getEstadoLoguin$().subscribe((value) => {
            this.islogged = value;
        });
        }



    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.usuarioLogueadoSubscription) {
            this.usuarioLogueadoSubscription.unsubscribe();
        }
    }

    openSuggestion(): void {
        this.classSearchSuggestionsOpen = true;
    }

    closeSuggestion(): void {
        this.classSearchSuggestionsOpen = false;
    }


    addToCart(product: Item): void {

        if (this.addedToCartProducts.includes(product)) {
            return;
        }

        if (this.StoreSvc.configuracionSitio.SuperarInventario) {
            this.cart.add(product, this.quantity.value).subscribe({
                complete: () => {
                    this.addedToCartProducts = this.addedToCartProducts.filter(eachProduct => eachProduct !== product);
                    this.quantity.reset(1)
                }
            });

        } else if ((product.inventario - product.inventarioPedido) >= this.quantity.value) {
            this.cart.add(product, this.quantity.value).subscribe({
                complete: () => {
                    this.addedToCartProducts = this.addedToCartProducts.filter(eachProduct => eachProduct !== product);
                    this.quantity.reset(1)
                }
            });
            this.addedToCartProducts.push(product);

        } else {
            this.toastr.error(`Producto "${this.utils.TitleCase(product.name)}" no tiene suficiente inventario, disponible:${(product.inventario - product.inventarioPedido)}`);
            this.quantity.reset(1)
        }
    }

    private cargarSugerencias() {

        if (this.suggestedProducts.length === 0) {
            this.articulossvc.getArticulosMasVendidos$().subscribe(data => {
                //this.suggestedProducts = this.articulossvc.getArticulosMasVendidos();
                 this.updatePagination(this.suggestedProducts.length);
                 this.hasSuggestions = true;
            });
        }

    }



    private suscribirBusqueda() {

        this.articulossvc.getArticulosBusqueda$().subscribe(data => {


            this.hasSuggestions = this.articulossvc.getArticulosBusqueda().length > 0;

            if (this.articulossvc.getArticulosBusqueda().length > 0) {
                this.suggestedProducts = []
                this.suggestedProducts = this.articulossvc.getArticulosBusqueda();
                this.updatePagination(this.suggestedProducts.length);
            }
        });

    }

    changePageSize(e: any, page: any) {
        e.preventDefault();
        this.optionPagination.pageArr = [];
        if (page == 'next') {
            if (this.optionPagination.page != this.optionPagination.totalPage)
                this.optionPagination.page += 1;
        } else if (page == 'previous') {
            if (this.optionPagination.page != 1)
                this.optionPagination.page -= 1;
        } else {
            this.optionPagination.page = parseInt(page);
        }

        this.optionPagination.first = (this.optionPagination.pageSize * this.optionPagination.page) - (this.optionPagination.pageSize);
        this.optionPagination.last = (this.optionPagination.pageSize * this.optionPagination.page) - 1;

        this.buildPagination()
    }

    updatePagination(leng: number) {
        this.accUPagination++
        this.optionPagination.pageArr = [];
        if (this.optionPagination.page > this.optionPagination.total) {
            this.optionPagination.page = 1;
            this.optionPagination.first = 0,
                this.optionPagination.last = (this.optionPagination.pageSize * this.optionPagination.page) - 1;
        }
        this.optionPagination.total = leng;
        this.optionPagination.totalPage = Math.ceil(this.optionPagination.total / this.optionPagination.pageSize);

        this.buildPagination()
    }

    buildPagination() {
        let pageDefault = true;
        for (let i = 1; i <= this.optionPagination.totalPage; i++) {
            if (i == 1) { //Primera pagina
                pageDefault = true
                this.optionPagination.pageArr.push(i);
            } else if (this.optionPagination.totalPage >= this.optionPagination.max_page && this.optionPagination.totalPage == i) { //Ultima pagina
                pageDefault = true
                this.optionPagination.pageArr.push(i);
            } else if (i > 1 && (this.optionPagination.page - i) < 2 && (this.optionPagination.page - i) > -2) { // para las que sean dos despues y las dos antariores
                pageDefault = true
                this.optionPagination.pageArr.push(i);
            } else if ((this.optionPagination.page == 1 && i == (this.optionPagination.page + 2)) || (this.optionPagination.totalPage == this.optionPagination.page && i == (this.optionPagination.page - 2))) { //Si estoy en la ultima o primera para las dos anteriores o las dos despues se vean
                pageDefault = true
                this.optionPagination.pageArr.push(i);
            } else if (this.optionPagination.max_page == this.optionPagination.totalPage) { //Si el tamaño de paginas es igual a la cantidad maxima a mostrar
                pageDefault = true
                this.optionPagination.pageArr.push(i);
            } else { // No cumple con las paginas por defecto
                if (pageDefault) {
                    this.optionPagination.pageArr.push('...');
                }
                pageDefault = false;
            }
        }
    }

    updateIsLogged() {
        if(isPlatformBrowser(this.platformId)) {
            this.islogged = localStorage.getItem("isLogue") === "true";
        }
    }

    showPrice(): boolean {
        const mostrarPreciosSinLogueo = this.StoreSvc.configuracionSitio.MostrarPreciosSinLogueo;
        return mostrarPreciosSinLogueo || (this.islogged && !mostrarPreciosSinLogueo);
    }
    
    available(product): boolean {                   
        const isAvailable =  (product.availability !== 'No Disponible' && product.inventario - product.inventarioPedido < 1 && !this.StoreSvc.configuracionSitio.SuperarInventario) || (product.availability === 'No Disponible' && !this.StoreSvc.configuracionSitio.SuperarInventario);     
        return isAvailable;
    }
    
}

