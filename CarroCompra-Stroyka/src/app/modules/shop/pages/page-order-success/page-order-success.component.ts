import { Component } from '@angular/core';
import { RootService } from '../../../../shared/services/root.service';
import { Router } from '@angular/router';

// servicios
import { PedidosService } from '../../../../../app/shared/services/pedidos.service';

// constantes
import { Crutas } from '../../../../../data/contantes/cRutas';

@Component({
    selector: 'app-page-order-success',
    templateUrl: './page-order-success.component.html',
    styleUrls: ['./page-order-success.component.scss']
})
export class PageOrderSuccessComponent {

    constructor(
        public pedidosvc: PedidosService,
        public root: RootService,
        private router: Router

    ) {

        if (this.pedidosvc.ordenactual === undefined){
            //this.router.navigate([Crutas.MiHistorial]);
        }    
    
    }

}
