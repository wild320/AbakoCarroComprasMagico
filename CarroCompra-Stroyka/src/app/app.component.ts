import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';


import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { CurrencyService } from './shared/services/currency.service';

import { NegocioService } from './shared/services/negocio.service';

// utils
import { UtilsTexto } from '../app/shared/utils/UtilsTexto';
import { RootComponent } from './components/root/root.component';
import { BlocksModule } from './modules/blocks/blocks.module';
import { HeaderModule } from './modules/header/header.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { UtilsModule } from './modules/utils/utils.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { StoreService } from './shared/services/store.service';
import { SharedModule } from './shared/shared.module';
import { ShopModule } from './modules/shop/shop.module';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        BlocksModule,
        HeaderModule,
        MobileModule,
        ShopModule,
        SharedModule,
        WidgetsModule,
        UtilsModule, RootComponent, RouterModule, RouterLink, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

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

        this.titleService.setTitle(this.negocio.configuracion.NombreCliente);

        if (isPlatformBrowser(this.platformId)) {
            eval(this.StoreSvc?.configuracionSitio?.scriptRastreo)

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

    TitleCase(texto) {
        texto = texto.toLowerCase().replace(/\b[a-z]/g, txt => {
            return txt.toUpperCase();
        });

        return texto;
    }

    ngOnInit(): void {
        // properties of the CurrencyFormatOptions interface fully complies
        // with the arguments of the built-in pipe "currency"
        // https://angular.io/api/common/CurrencyPipe
        this.currency.options = {
            code: 'COP',
            display: 'code',
            digitsInfo: '1.0-2',
            // locale: 'en-US'
        };

        this.router.events.subscribe((event) => {
            if ((event instanceof NavigationEnd)) {
                this.scroller.scrollToPosition([0, 0]);
            }
        });
        this.cart.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado al Carrito!`);
        });
        this.compare.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado para Comparar!`);
        });
        this.wishlist.onAdding$.subscribe(product => {
            this.toastr.success(`Producto "${this.TitleCase(product.name)}" Agregado a la Lista de Deseos!`);
        });

        this.metaTagService.addTags([
            {
                name: 'description',
                content: this.StoreSvc.configuracionSitio.PosicionamientoEnGoogle,
            },
        ]);

        // this.metaTagService.updateTag({
        //     name: 'keywords',
        //     content: this.StoreSvc.configuracionSitio.PalabrasClaves,
        // })
        // this.metaTagService.updateTag({
        //     name: 'robots',
        //     content: 'index, follow',
        // })

        // this.metaTagService.updateTag({
        //     name: 'og:title',
        //     content: this.StoreSvc.configuracionSitio.NombreCliente,
        // })
        // this.metaTagService.updateTag({
        //     name: 'og:description',
        //     content: this.StoreSvc.configuracionSitio.PosicionamientoEnGoogle,
        // })
        // this.metaTagService.updateTag({
        //     name: 'og:image',
        //     content: this.StoreSvc.configuracionSitio.LogoUrl,
        // })
        // this.metaTagService.updateTag({
        //     name: 'og:url',
        //     content: this.router.url,
        // })
        // this.metaTagService.updateTag({
        //     name: 'og:site_name',
        //     content: this.StoreSvc.configuracionSitio.NombreCliente,
        // })

        // this.metaTagService.updateTag({
        //     name: 'twitter:card',
        //     content:'summary_large_image',
        // })
        // this.metaTagService.updateTag({
        //     name: 'twitter:title',
        //     content: this.StoreSvc.configuracionSitio.NombreCliente,
        // })
        // this.metaTagService.updateTag({
        //     name: 'twitter:description',
        //     content: this.StoreSvc.configuracionSitio.PosicionamientoEnGoogle,
        // })
        // this.metaTagService.updateTag({
        //     name: 'twitter:image',
        //     content: this.StoreSvc.configuracionSitio.LogoUrl,
        // })
        // this.metaTagService.updateTag({
        //     name: 'twitter:url',
        //     content: this.router.url,
        // })
    }
}

