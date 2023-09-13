import { Component } from '@angular/core';
import { theme } from '../../../data/theme';
import { Link } from '../../shared/interfaces/link';

// servivios
import {StoreService } from '../../shared/services/store.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// constantes
import { Crutas, ClabelRutas } from 'src/data/contantes/cRutas';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    theme = theme;
    links: Link[];
    linksMicuenta: Link[];

    constructor(public storeService: StoreService,
                public usuariosvc: UsuarioService,
                public storeSvc: StoreService,
        ) {

        this.CargarMenuMicuenta();

        const index = this.storeService.navigation.findIndex(x => x.label === 'Sitios');
        const item = 'items';

        this.links =  this.storeService.navigation[index].menu[item];

     }

     CargarMenuMicuenta() {

        // tslint:disable-next-line: deprecation
        this.usuariosvc.getEstadoLoguin$().subscribe((value) => {

            this.linksMicuenta = [];

            if (value){

                this.linksMicuenta.push({label: 'Historial de Pedidos',  url: Crutas.MiHistorial});
                this.linksMicuenta.push( {label: ClabelRutas.listaDeseo,   url: Crutas.listaDeseo});
            }

            this.linksMicuenta.push({label: 'Suscribirse',      url: Crutas.Registrarse});

        });

    }
}

