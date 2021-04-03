import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

// servicios
import { PedidosService } from '../../../../../app/shared/services/pedidos.service';
import { UsuarioService } from '../../../../../app/shared/services/usuario.service';

// constantes
import { Crutas } from '../../../../../data/contantes/cRutas';


@Component({
    selector: 'app-page-order-details',
    templateUrl: './page-order-details.component.html',
    styleUrls: ['./page-order-details.component.scss']
})
export class PageOrderDetailsComponent implements OnInit {

    constructor(public usuariosvc: UsuarioService,
                private rutaActiva: ActivatedRoute,
                public pedidosvc: PedidosService,
                private router: Router) {

        this.RecuperarDetallePedidos (this.rutaActiva.snapshot.params.orderId);

     }

     ngOnInit() {  }

    RecuperarDetallePedidos(pedido: number){

        // si es indefinido debe recuperar nuevamente los pedidos
        if (this.pedidosvc.orders === undefined){

            this.router.navigate([Crutas.MiHistorial]);

        }

        // sacar el numero de pedido
        const index = this.pedidosvc.orders.findIndex( x => x.pedido === pedido);

        const IdPedido =  this.pedidosvc.orders[index].idPedido;

        this.pedidosvc.cargarDetallePedido(IdPedido, index).then((resp: any) => {

            // console.log(this.pedidosvc.ordenactual);

        });

    }
}
