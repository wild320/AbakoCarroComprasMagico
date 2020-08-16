import { Component, Input } from '@angular/core';
import { StoreService } from '../../shared/services/store.service';

import { NegocioService } from '../../shared/services/negocio.service';
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
    ) {

        this.logo = Cconfiguracion.urlAssetsConfiguracion + this.negocio.configuracion.Logo ;

    }


}
