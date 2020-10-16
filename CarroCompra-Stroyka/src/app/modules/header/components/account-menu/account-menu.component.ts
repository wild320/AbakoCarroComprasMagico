import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import {  FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// Modelos
import { LoginClienteResponse } from 'src/data/modelos/seguridad/LoginClienteResponse';


@Component({
    selector: 'app-account-menu',
    templateUrl: './account-menu.component.html',
    styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit{
    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    public ingresoForm: FormGroup;
    usuariologueado = false;
    razonsocial: string;
    correo: string;
    public error = false;
    UsrLogin: Observable<LoginClienteResponse>;
    public mensajeerror: string;
    public loading = false;

    constructor(public usuariosvc: UsuarioService,
                private fb: FormBuilder,
                private router: Router
                ) {

        this.EstaLogueadoUsuario();

    }

    ngOnInit() {

        this.ingresoForm = this.fb.group({
          usuario: new FormControl('', Validators.compose([Validators.required])),
          contrasena: new FormControl('', Validators.compose([Validators.required])),
          recordar: new FormControl(false, [])
        });

        this.ingresoForm.valueChanges.subscribe(query => {
          if (this.error){ this.error = false; }
        });

    }

    submitForm() {

        this.loading = true;

        if (this.ingresoForm.valid){

          this.usuariosvc.Loguin(this.ingresoForm.value).then((config: any) => {

            // si no llega logueado validar mensaje
            if  (!this.usuariosvc.logueo){
              this.mensajeerror = this.usuariosvc.MensajeError;
              this.error = true;
             }else{

              this.error = false;

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

          this.error = true;
          this.loading = false;

        }
      }

      get usuario() { return this.ingresoForm.get('usuario'); }

      get contrasena() { return this.ingresoForm.get('contrasena'); }

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
                this.razonsocial = value.usuario[0].rzScl;
                this.correo = value.usuario[0].mail.toLowerCase();
            });
        }
    }

    CerrarSesion(){
        this.usuariosvc.loguout();
    }

}
