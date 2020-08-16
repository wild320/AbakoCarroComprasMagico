import { /*LOCALE_ID, */NgModule, APP_INITIALIZER } from '@angular/core';
// import { registerLocaleData } from '@angular/common';
// import localeIt from '@angular/common/locales/it';
//
// registerLocaleData(localeIt, 'it');

// modules (angular)
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ToastrModule } from 'ngx-toastr';

// modules
import { AppRoutingModule } from './app-routing.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { FooterModule } from './modules/footer/footer.module';
import { HeaderModule } from './modules/header/header.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { SharedModule } from './shared/shared.module';
import { WidgetsModule } from './modules/widgets/widgets.module';

// components
import { AppComponent } from './app.component';
import { RootComponent } from './components/root/root.component';

// pages
import { PageHomeOneComponent } from './pages/page-home-one/page-home-one.component';
import { PageHomeTwoComponent } from './pages/page-home-two/page-home-two.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PageOffcanvasCartComponent } from './pages/page-offcanvas-cart/page-offcanvas-cart.component';

// servicios
import { NegocioService } from './shared/services/negocio.service';
import { StoreService } from './shared/services/store.service';

// Confoguracion inicial
export function CargarConfiguracion(configLocal: NegocioService, configGeneral: StoreService) {
    return () => configLocal.cargarConfiguracionLocal().then(() => configGeneral.cargarConfiguracionGeneral()); }

@NgModule({
    declarations: [
        // components
        AppComponent,
        RootComponent,
        // pages
        PageHomeOneComponent,
        PageHomeTwoComponent,
        PageNotFoundComponent,
        PageOffcanvasCartComponent
    ],
    imports: [
        // modules (angular)
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        // modules (third-party)
        CarouselModule,
        ToastrModule.forRoot(),
        // modules
        AppRoutingModule,
        BlocksModule,
        FooterModule,
        HeaderModule,
        MobileModule,
        SharedModule,
        WidgetsModule
    ],
    providers: [
          NegocioService,
          StoreService,
            {
            provide: APP_INITIALIZER,
            useFactory: CargarConfiguracion,
            multi: true,
            deps: [NegocioService, StoreService]
            },
        ],
    bootstrap: [AppComponent]
})
export class AppModule { }
