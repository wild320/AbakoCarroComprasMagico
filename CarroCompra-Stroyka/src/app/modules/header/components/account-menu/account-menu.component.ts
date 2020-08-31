import { Component, EventEmitter, Output } from '@angular/core';
import {Observable} from 'rxjs';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { LoginClienteResponse } from 'src/data/modelos/seguridad/LoginClienteResponse';


@Component({
    selector: 'app-account-menu',
    templateUrl: './account-menu.component.html',
    styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent {
    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    usuariologueado = false;
    usuario: string;
    correo: string;
    UsrLogin: Observable<LoginClienteResponse>;

    constructor(public usuariosvc: UsuarioService
                ) {

        this.EstaLogueadoUsuario();

    }

    EstaLogueadoUsuario(){

        this.usuariosvc.getEstadoLogueo().subscribe((value) => {

            this.usuariologueado = value;

            this.CargarUsuario();
        });
    }

    CargarUsuario(){

        if (this.usuariologueado) {

            this.UsrLogin = this.usuariosvc.getUsrLoguin();

            this.UsrLogin.subscribe((value) => {
                this.usuario = value.usuario[0].assr;
                this.correo = value.usuario[0].mail.toLowerCase();
            });
        }
    }

    CerrarSesion(){
        this.usuariosvc.loguout();
    }

}
