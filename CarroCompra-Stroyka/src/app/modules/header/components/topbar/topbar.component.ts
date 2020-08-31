import { Component } from '@angular/core';
import { CurrencyService } from '../../../../shared/services/currency.service';

// servicios
import { PaginasService } from '../../../../shared/services/paginas.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
    selector: 'app-header-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
    usuariologueado = false;
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
        public currencyService: CurrencyService,
        public pagina: PaginasService,
        public usuariosvc: UsuarioService
    ) {

        this.EstaLogueadoUsuario();

    }

    setCurrency(currency): void {
        this.currencyService.options = {
            code: currency.code,
            display: currency.symbol,
        };

    }

    EstaLogueadoUsuario(){

        this.usuariosvc.getEstadoLogueo().subscribe((value) => {

            this.usuariologueado = value;

        });

    }
}
