import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

// servicios
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// constantes
import { Crutas } from 'src/data/contantes/cRutas';


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

        this.pedidosvc.cargarDetallePedido(pedido).then((resp: any) => {

            // console.log(this.pedidosvc.ordenactual);

        });

    }
}
