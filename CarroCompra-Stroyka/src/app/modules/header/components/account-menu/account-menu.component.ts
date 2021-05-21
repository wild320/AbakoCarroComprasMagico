import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import {  FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// Modelos
import { LoginClienteResponse } from 'src/data/modelos/seguridad/LoginClienteResponse';
import { EstadoRespuestaMensaje } from 'src/data/contantes/cMensajes';

// constantes
import { Crutas } from 'src/data/contantes/cRutas';

@Component({
    selector: 'app-account-menu',
    templateUrl: './account-menu.component.html',
    styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit{
    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    public ingresoForm: FormGroup;
    usuariologueado = false;
    UsrLogin: Observable<LoginClienteResponse>;
    public mensajeerror: string;
    public loading = false;
    public RutaRecuperarContrasena = Crutas.RecuperarContrasena;

    constructor(public usuariosvc: UsuarioService,
                private fb: FormBuilder,
                private router: Router
                ) {

      this.InicializarValores();
    }

    ngOnInit() {

        this.ingresoForm = this.fb.group({
          usuario: new FormControl('', Validators.compose([Validators.required])),
          contrasena: new FormControl('', Validators.compose([Validators.required])),
          recordar: new FormControl(false, [])
        });

        this.InicializarValores();

        this.EstaLogueadoUsuario();

    }

    InicializarValores(){
      this.mensajeerror = '';
    }

    submitForm() {

        this.loading = true;

        this.InicializarValores();

        if (this.ingresoForm.valid){

          this.usuariosvc.Loguin(this.ingresoForm.value).then((config: any) => {

            // si no llega logueado validar mensaje
            if  (config.msgId !== EstadoRespuestaMensaje.exitoso || this.usuariosvc.MensajeError.length > 0 ){

              if (config.msgId === EstadoRespuestaMensaje.Error){
                this.mensajeerror = config.msgStr;
              }else{
                this.mensajeerror = this.usuariosvc.MensajeError;
              }

            }else{

               // direccionar al home
               this.router.navigate(['/']);

            }

            this.loading = false;

          });
        }else{

          // validar que tenga contraseña
          if (this.contrasena.invalid){
            this.mensajeerror = 'Debe ingresar información valida en contraseña';
          }

          // validar que tenga usuario
          if (this.usuario.invalid){
            this.mensajeerror = 'Debe ingresar información valida en usuario';
          }

          this.loading = false;

        }
      }

    EstaLogueadoUsuario(){

        this.usuariosvc.getEstadoLoguin$().subscribe((value) => {

            this.usuariologueado = value;

            this.CargarUsuario();
        });
    }

    CargarUsuario(){

        if (this.usuariologueado) {

            this.UsrLogin = this.usuariosvc.getUsrLoguin();

            this.UsrLogin.subscribe((value) => { });
        }
    }

    CerrarSesion(){
        this.usuariosvc.loguout();
    }

    get usuario() { return this.ingresoForm.get('usuario'); }

    get contrasena() { return this.ingresoForm.get('contrasena'); }

}
