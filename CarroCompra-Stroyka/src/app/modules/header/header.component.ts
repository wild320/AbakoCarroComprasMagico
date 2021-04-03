import { Component, Input } from '@angular/core';

// servicios
import { StoreService } from '../../shared/services/store.service';
import { NegocioService } from '../../shared/services/negocio.service';
import { ServiciosnegocioService } from '../../shared/services/serviciosnegocio.service'

// constantes
import { Cconfiguracion } from '../../../data/contantes/cConfiguracion';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {
    @Input() layout: 'classic'|'compact' = 'classic';

    logo: string;

    constructor(public store: StoreService,
                public negocio: NegocioService,
                private ServiciosnegocioSVC: ServiciosnegocioService,
    ) {

        this.logo = Cconfiguracion.urlAssetsConfiguracion + this.negocio.configuracion.Logo ;

        this.ServiciosnegocioSVC.getLocation();

    }


}
