// import { /*LOCALE_ID, */NgModule, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
// // import { registerLocaleData } from '@angular/common';
// // import localeIt from '@angular/common/locales/it';
// //
// // registerLocaleData(localeIt, 'it');

// // modules (angular)
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {BrowserModule } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// // modules (third-party)
// import { CarouselModule } from 'ngx-owl-carousel-o';
// import { ToastrModule } from 'ngx-toastr';


// // modules
// import { AppRoutingModule } from './app-routing.module';
// import { BlocksModule } from './modules/blocks/blocks.module';
// import { FooterModule } from './modules/footer/footer.module';
// import { HeaderModule } from './modules/header/header.module';
// import { MobileModule } from './modules/mobile/mobile.module';
// import { SharedModule } from './shared/shared.module';
// import { WidgetsModule } from './modules/widgets/widgets.module';
// import { UtilsModule } from './modules/utils/utils.module';

// // components
// import { RootComponent } from './components/root/root.component';

// // pages
// import { PageHomeOneComponent } from './pages/page-home-one/page-home-one.component';
// import { PageHomeTwoComponent } from './pages/page-home-two/page-home-two.component';
// import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
// import { PageOffcanvasCartComponent } from './pages/page-offcanvas-cart/page-offcanvas-cart.component';

// // servicios
// import { NegocioService } from './shared/services/negocio.service';
// import { StoreService } from './shared/services/store.service';
// import {ServiceHelper} from './shared/services/ServiceHelper';
// import { UsuarioService } from './shared/services/usuario.service';
// import { BannerService } from './shared/services/banner.service';

// // utils
// import {UtilsTexto} from './shared/utils/UtilsTexto';
// import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
// import { isPlatformBrowser } from '@angular/common';

// // Configuracion inicial
// export function CargarConfiguracion(configLocal: NegocioService, configGeneral: StoreService, usuario: UsuarioService, banner:  BannerService) {
//     return () => configLocal.cargarConfiguracionLocal()
//         .then(() => configGeneral.cargarConfiguracionGeneral()
//             .then(() => usuario.cargarUsuarioStorage())
//             .then(() => banner.cargarBanner())
//                 .then()
//         );
// }

// @NgModule({
//     declarations: [
//         // components
//         RootComponent,
//         // pages
//         PageHomeOneComponent,
//         PageHomeTwoComponent,
//         PageNotFoundComponent,
//         PageOffcanvasCartComponent
//     ],
//     imports: [
//         // modules (angular)
//         BrowserModule.withServerTransition({ appId: 'serverApp' }),
//         BrowserAnimationsModule,
//         ReactiveFormsModule,
//         FormsModule,
//         // modules (third-party)
//         CarouselModule,
//         ToastrModule.forRoot({
//           timeOut: 3000, 
//           positionClass: 'toast-top-right',
//           preventDuplicates: true,
//         }),
//         // modules
//         AppRoutingModule,
//         BlocksModule,
//         FooterModule,
//         HeaderModule,
//         MobileModule,
//         SharedModule,
//         WidgetsModule,
//         UtilsModule,
//         ServiceWorkerModule.register('ngsw-worker.js', {
//           enabled: environment.production,
//           // Register the ServiceWorker as soon as the app is stable
//           // or after 30 seconds (whichever comes first).
//           registrationStrategy: 'registerWhenStable:30000'
//         })
//     ],
//     providers: [
//           ServiceHelper,
//           UtilsTexto,
//           NegocioService,
//           UsuarioService,
//           BannerService,
//           StoreService,
//             {
//             provide: APP_INITIALIZER,
//             useFactory: CargarConfiguracion,
//             multi: true,
//             deps: [NegocioService, StoreService, UsuarioService, BannerService]
//             },
//             { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [PLATFORM_ID] },
//         ]
// })
// export class AppModule { }

// export function getBaseUrl(platformId: Object) {
//     if (isPlatformBrowser(platformId)) {
//       return document.getElementsByTagName('base')[0]?.href || '/';
//     } else {
//       return '/'; // Provide a default value or handle it as needed for server-side
//     }
//   }
