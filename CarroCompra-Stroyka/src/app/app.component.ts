import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';


import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { CurrencyService } from './shared/services/currency.service';

import { NegocioService } from './shared/services/negocio.service';

// utils
import { Cconfiguracion } from 'src/data/contantes/cConfiguracion';
import { ConfiguracionSitio } from 'src/data/modelos/negocio/ConfiguracionSitio';
import { UtilsTexto } from '../app/shared/utils/UtilsTexto';
import { RootComponent } from './components/root/root.component';
import { BlocksModule } from './modules/blocks/blocks.module';
import { HeaderModule } from './modules/header/header.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { ShopModule } from './modules/shop/shop.module';
import { UtilsModule } from './modules/utils/utils.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { StoreService } from './shared/services/store.service';
import { SharedModule } from './shared/shared.module';

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
        private metaTagService: Meta,
        private route: ActivatedRoute
    ) {

        this.route.data.subscribe(data => {
            const negocio = this.negocio.configuracion;
            const StoreSvc = this.StoreSvc.configuracionSitio;
            this.titleService.setTitle(negocio.NombreCliente);
            this.generateMetaTag(StoreSvc);
        });


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
    generateMetaTag(StoreSvc: ConfiguracionSitio) {
        const baseUrl = this.negocio.configuracion.baseUrl;
        const siteTitle = this.negocio.configuracion.NombreCliente;
        const siteDescription = StoreSvc.PosicionamientoEnGoogle;
        const siteImage = `${baseUrl}/${Cconfiguracion.urlAssetsConfiguracion}LOGO2.png`;
        const socialMedia = this.StoreSvc.redes;
        console.log(socialMedia);

        this.metaTagService.addTags([
            // Meta tags para SEO
            { name: 'title', content: siteTitle },
            { name: 'description', content: siteDescription },
            { name: 'keywords', content: 'comprar online, ecommerce, productos, tienda en línea, ' + siteTitle }, // Puedes añadir más keywords relevantes
            { name: 'author', content: StoreSvc.email },
            { name: 'robots', content: 'index, follow' }, // Para permitir la indexación de motores de búsqueda
            { name: 'canonical', content: baseUrl }, // URL canónica para evitar contenido duplicado

            // Open Graph meta tags (para compartir en redes sociales como Facebook)
            { property: 'og:title', content: siteTitle },
            { property: 'og:description', content: siteDescription },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: baseUrl },
            { property: 'og:image', content: siteImage },
            { property: 'og:site_name', content: siteTitle },
            { property: 'og:locale', content: 'es_CO' }, // Locale para definir el idioma del contenido

            // Twitter Card meta tags (para compartir en Twitter)
            { name: 'twitter:card', content: 'summary_large_image' }, // Usa 'summary_large_image' para una mejor visualización
            { name: 'twitter:title', content: siteTitle },
            { name: 'twitter:description', content: siteDescription },
            { name: 'twitter:image', content: siteImage },
            { name: 'twitter:site', content: '@tuTwitterHandle' }, // Reemplaza con tu handle de Twitter si tienes
            { name: 'twitter:creator', content: '@tuTwitterHandle' }, // Reemplaza con el handle del autor si lo tienes

            // Meta tags adicionales útiles
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // Para diseño responsivo
            { name: 'apple-mobile-web-app-capable', content: 'yes' }, // Habilita app en iOS
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }, // Estilo de la barra de estado en iOS
            { name: 'format-detection', content: 'telephone=no' }, // Para evitar el formateo automático de números de teléfono
        ]);
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
            this.toastr.success(`Producto "${this.utils.TitleCase(product.name)}" Agregado a la Lista de Deseos!`);
        });

    }
}

