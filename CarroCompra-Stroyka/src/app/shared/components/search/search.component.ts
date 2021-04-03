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
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { RootService } from '../../services/root.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime,  takeUntil } from 'rxjs/operators';
import { fromEvent,  Subject } from 'rxjs';
import { Category } from '../../interfaces/category';
import { DOCUMENT } from '@angular/common';
import { CartService } from '../../services/cart.service';

// modelos
import { Item } from '../../../../data/modelos/articulos/Items';

// Servicios
import { ArticulosService} from '../../../shared/services/articulos.service'

export type SearchLocation = 'header' | 'indicator' | 'mobile-header';

export type CategoryWithDepth = Category & {depth: number};

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    exportAs: 'search',
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    form: FormGroup;

    hasSuggestions = false;

    suggestedProducts: Item[] = [];

    addedToCartProducts: Item[] = [];

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

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private fb: FormBuilder,
        private elementRef: ElementRef,
        private zone: NgZone,
        private cart: CartService,
        public root: RootService,
        private articulossvc: ArticulosService,
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

            if (query.length > 2 ){

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
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

        this.addedToCartProducts.push(product);
        this.cart.add(product, 1).subscribe({
            complete: () => {
                this.addedToCartProducts = this.addedToCartProducts.filter(eachProduct => eachProduct !== product);
            }
        });
    }
 
    private cargarSugerencias(){

        if (this.suggestedProducts.length === 0 ){
            this.articulossvc.getArticulosMasVendidos$().subscribe(data => {
                this.suggestedProducts = this.articulossvc.getArticulosMasVendidos().slice(0,6);
                this.hasSuggestions = true;
            });
        }

    }

    private suscribirBusqueda(){

        this.articulossvc.getArticulosBusqueda$().subscribe(data => {

            this.hasSuggestions = this.articulossvc.getArticulosBusqueda().slice(0,12).length > 0;

            if (this.articulossvc.getArticulosBusqueda().length > 0) {
                this.suggestedProducts  = []
                this.suggestedProducts = this.articulossvc.getArticulosBusqueda().slice(0,12);
            }
        });

    }
}

