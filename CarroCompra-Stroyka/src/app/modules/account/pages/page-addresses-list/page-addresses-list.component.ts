import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

// componentes
import { DialogoSiNoComponent } from '../../../utils/components/dialogo-si-no/dialogo-si-no.component';

// Contantes
import { EstadoRespuestaMensaje } from 'src/data/contantes/cMensajes';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Cstring } from 'src/data/contantes/cString';


@Component({
    selector: 'app-page-addresses-list',
    templateUrl: './page-addresses-list.component.html',
    styleUrls: ['./page-addresses-list.component.sass']
})
export class PageAddressesListComponent implements OnInit {

    eliminando: boolean;

    constructor(public usuariosvc: UsuarioService,
                public dialog: MatDialog,
                private snackBar: MatSnackBar) { }

    ngOnInit() {

      this.eliminando = false;

    }


    openDialog(direccion){

      this.eliminando = true;

      const dialogRef = this.dialog.open(DialogoSiNoComponent, {
        width: '350px',
        data: {titulo: 'Eliminar Dirección', mensaje: 'Desea eliminar la dirección ' + direccion.direccion + '?'}

      });

      dialogRef.afterClosed().subscribe(result => {

        if (result === Cstring.SI){

          if (direccion.Id > 0) {

            this.usuariosvc.EliminarDireccion(direccion.Id).then((ret: any) => {

                let mensaje = '';

                if (ret.estado[0].msgId === EstadoRespuestaMensaje.Error ){
                  mensaje = ret.estado[0].msgStr;

                }else{
                  mensaje = 'Dirección eliminada con éxito';
                }

                this.snackBar.open(mensaje, 'OK', {
                  duration: 2000,
                });

            });
          }
        }

      });

      this.eliminando = false;

    }

}
