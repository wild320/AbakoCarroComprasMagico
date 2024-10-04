import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';


import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser, TitleCasePipe, ViewportScroller } from '@angular/common';
import { CurrencyService } from './shared/services/currency.service';
import { filter, first } from 'rxjs/operators';

import { NegocioService } from './shared/services/negocio.service';

// utils
import {UtilsTexto} from '../app/shared/utils/UtilsTexto';
import { StoreService } from './shared/services/store.service';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    toastOptions: Partial<IndividualConfig>= {
        timeOut: 1000,
        tapToDismiss: true,
    };
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private toastr: ToastrService,
        private cart: CartService,
        private compare: CompareService,
        private wishlist: WishlistService,
        private zone: NgZone,
        private utils: UtilsTexto,
        private scroller: ViewportScroller,
        private currency: CurrencyService,
        private negocio: NegocioService,
        private titleService: Title,
        public StoreSvc: StoreService,
        private metaTagService: Meta
    ) {

        this.titleService.setTitle( this.negocio.configuracion.NombreCliente);

        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.router.events.pipe(filter(event => event instanceof NavigationEnd), first()).subscribe(() => {
                    const preloader = document.querySelector('.site-preloader');

                    preloader.addEventListener('transitionend', (event: TransitionEvent) => {
                        if (event.propertyName === 'opacity') {
                            preloader.remove();
                        }
                    });
                    preloader.classList.add('site-preloader__fade');
                });
            });
        }

    }

    ngOnInit(): void {
        eval(this.StoreSvc?.configuracionSitio?.scriptRastreo)
        // properties of the CurrencyFormatOptions interface fully complies
        // with the arguments of the built-in pipe "currency"
        // https://angular.io/api/common/CurrencyPipe
        this.currency.options = {
            code: 'COP',
            display:  'code',
            digitsInfo: '1.0-2',
            // locale: 'en-US'
        };

        this.router.events.subscribe((event) => {
            if ((event instanceof NavigationEnd)) {
                this.scroller.scrollToPosition([0, 0]);
            }
        });
        this.cart.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado al Carrito!`, '', this.toastOptions);
        });
        this.compare.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado para Comparar!`, '', this.toastOptions);
        });
        this.wishlist.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado a la Lista de Deseos!`, '', this.toastOptions);
        });

        this.metaTagService.addTags([
            {
             name: 'description',
              content: this.StoreSvc.configuracionSitio.PosicionamientoEnGoogle,
            },
          ]);
        }
    }

