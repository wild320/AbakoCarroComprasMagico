import { Component , Inject, OnInit, PLATFORM_ID} from '@angular/core';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-page-orders-list',
    templateUrl: './page-orders-list.component.html',
    styleUrls: ['./page-orders-list.component.sass']
})
export class PageOrdersListComponent implements OnInit{

    public pagina = 1;
    public Recuperarregistro = false;

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: Object,public usuariosvc: UsuarioService,
                public pedidosvc: PedidosService) { }


    ngOnInit() {

        this.EstaLogueadoUsuario();
    }

    EstaLogueadoUsuario(){
        if (isPlatformBrowser(this.platformId)) {

            this.usuariosvc.getEstadoLoguin$().subscribe((value) => {
    
                if (value){
    
                    this.RecuperarPedidos();
    
                }
            });
        }

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
