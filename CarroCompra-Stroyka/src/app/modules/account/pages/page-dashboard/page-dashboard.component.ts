import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { PedidosService } from 'src/app/shared/services/pedidos.service';

// Modelos
import { LoginClienteResponse } from 'src/data/modelos/seguridad/LoginClienteResponse';


@Component({
    selector: 'app-page-dashboard',
    templateUrl: './page-dashboard.component.html',
    styleUrls: ['./page-dashboard.component.sass']
})
export class PageDashboardComponent implements OnInit {

    constructor(public usuariosvc: UsuarioService,
                public pedidosvc: PedidosService) {

    }

    ngOnInit() {

        this.EstaLogueadoUsuario();
    }

    EstaLogueadoUsuario(){

        this.usuariosvc.getEstadoLoguin$().subscribe((value) => {

            if (value){

                const idempresa = this.usuariosvc.Idempresa;
                const pagina = 1;

                this.pedidosvc.cargarPedidos(idempresa, pagina ).then((resp: any) => {
                    // console.log(resp);

                }) ;
            }
        });

    }

}
