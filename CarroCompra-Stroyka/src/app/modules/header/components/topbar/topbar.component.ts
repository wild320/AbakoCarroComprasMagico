import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CurrencyService } from '../../../../shared/services/currency.service';
import { Link } from '../../../../shared/interfaces/link';

// servicios
import { PaginasService } from '../../../../shared/services/paginas.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// constantes
import { Crutas, ClabelRutas } from 'src/data/contantes/cRutas';
import { StoreService } from 'src/app/shared/services/store.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'app-header-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
    usuariologueado = false;
    linksMicuenta: Link[];
    languages = [
        {name: 'Español', image: 'language-6'},
  //      {name: 'English', image: 'language-1'},
  //      {name: 'French',  image: 'language-2'},
  //      {name: 'German',  image: 'language-3'},
  //      {name: 'Russian', image: 'language-4'},
  //      {name: 'Italian', image: 'language-5'}
    ];

    currencies = [
        {name: '$ Peso Colombia',           url: '', code: 'COP', symbol: '$'},
   //     {name: '€ Euro',           url: '', code: 'EUR', symbol: '€'},
   //     {name: '£ Pound Sterling', url: '', code: 'GBP', symbol: '£'},
   //     {name: '$ US Dollar',      url: '', code: 'USD', symbol: '$'},
   //     {name: '₽ Russian Ruble',  url: '', code: 'RUB', symbol: '₽'}
    ];

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: Object,
        public currencyService: CurrencyService,
        public pagina: PaginasService,
        public usuariosvc: UsuarioService,
        public storeSvc: StoreService,
    ) {

        this.EstaLogueadoUsuario();

        this.CargarMenu();

    }

    setCurrency(currency): void {

        this.currencyService.options = {
            code: currency.code,
            display: currency.symbol,
        };

    }

    EstaLogueadoUsuario(){
        if (isPlatformBrowser(this.platformId)) {

            this.usuariosvc.getEstadoLoguin$().subscribe((value) => {
    
                this.usuariologueado = value;
    
            });
        }


    }

    CargarMenu() {

            this.linksMicuenta = [];

            this.linksMicuenta.push({label: ClabelRutas.Dashboard,  url: Crutas.Dashboard});
            this.linksMicuenta.push({label: ClabelRutas.EditarCuenta,  url: Crutas.EditarCuenta});
            this.linksMicuenta.push({label: 'Historial Pedidos',  url: Crutas.MiHistorial});
            this.linksMicuenta.push({label: ClabelRutas.MisDirecciones, url: Crutas.MisDirecciones});
            this.linksMicuenta.push({label: ClabelRutas.Cotrasena,  url: Crutas.Cotrasena});
            this.linksMicuenta.push({label: ClabelRutas.CerrarSesion,  url: Crutas.CerrarSesion});

    }

}
