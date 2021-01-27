import { Component , OnInit} from '@angular/core';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { PedidosService } from 'src/app/shared/services/pedidos.service';

@Component({
    selector: 'app-page-orders-list',
    templateUrl: './page-orders-list.component.html',
    styleUrls: ['./page-orders-list.component.sass']
})
export class PageOrdersListComponent implements OnInit{

    public pagina = 1;
    public Recuperarregistro = false;

    constructor(public usuariosvc: UsuarioService,
                public pedidosvc: PedidosService) { }


    ngOnInit() {

        this.EstaLogueadoUsuario();
    }

    EstaLogueadoUsuario(){

        this.usuariosvc.getEstadoLoguin$().subscribe((value) => {

            if (value){

                this.RecuperarPedidos();

            }
        });
    }

    RecuperarPedidos(){

        const idempresa = this.usuariosvc.Idempresa;

        this.pedidosvc.cargarPedidos(idempresa, this.pagina).then((resp: any) => {
            // console.log(resp);

        }) ;

    }

    CambioPagina(evento: number){

        this.pagina = evento;

        this.RecuperarPedidos();
    }
}
