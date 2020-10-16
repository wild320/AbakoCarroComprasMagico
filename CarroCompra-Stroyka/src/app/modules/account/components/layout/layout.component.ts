import { Component } from '@angular/core';
import { Router } from '@angular/router';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// constantes
import { Crutas, ClabelRutas } from 'src/data/contantes/cRutas';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.sass']
})
export class LayoutComponent {
    links: {label: string; url: string}[] = [
        {label: ClabelRutas.Dashboard, url: Crutas.Dashboard},
        {label: ClabelRutas.EditarCuenta, url:  Crutas.EditarCuenta},
        {label: ClabelRutas.MiHistorial, url: Crutas.MiHistorial},
        {label: ClabelRutas.MisDirecciones, url: Crutas.MisDirecciones},
        {label: ClabelRutas.Cotrasena, url: Crutas.Cotrasena},
        {label: ClabelRutas.CerrarSesion, url: Crutas.CerrarSesion}
    ];

    constructor(public usuariosvc: UsuarioService,
                private router: Router) { }

    onClick(e) {

        // cerrar sesión
        if (e.target.innerHTML === ClabelRutas.CerrarSesion){

            this.usuariosvc.loguout();

            // direccionar al home
            this.router.navigate(['/']);
         }
    }
}
