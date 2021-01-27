import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';

// servicios
import {UsuarioService} from '../../../../shared/services/usuario.service';

// constantes
import { Crutas } from 'src/data/contantes/cRutas';

@Component({
    selector: 'app-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit{

    public ingresoForm: FormGroup;
    public registroForm: FormGroup;
    public error = false;
    public errorRegistro = false;
    public mensajeerror: string;
    public mensajeerroRegistro: string;
    public loading = false;
    public loadingRegistro = false;
    public RutaRecuperarContrasena = Crutas.RecuperarContrasena;

    constructor(
        private fb: FormBuilder,
        private usuariossvc: UsuarioService,
        private router: Router ) {

    }

    ngOnInit() {

        this.ingresoForm = this.fb.group({
          usuario: new FormControl('', Validators.compose([Validators.required])),
          contrasena: new FormControl('', Validators.compose([Validators.required])),
          recordar: new FormControl(false, [])
        });

        this.registroForm = this.fb.group({
          identificacion: new FormControl('', Validators.compose([Validators.required])),
          Nombres: new FormControl('', Validators.compose([Validators.required])),
          Apellidos: new FormControl('', Validators.compose([Validators.required])),
        });

        this.ingresoForm.valueChanges.subscribe(query => {
          if (this.error){ this.error = false; }
        });

        this.registroForm.valueChanges.subscribe(query => {
          if (this.errorRegistro){ this.errorRegistro = false; }
        });

      }

    submitForm() {

      this.loading = true;

      if (this.ingresoForm.valid){

        this.usuariossvc.Loguin(this.ingresoForm.value).then((config: any) => {

          // si no llega logueado validar mensaje
          if  (!this.usuariossvc.getEstadoLoguin()){
            this.mensajeerror = this.usuariossvc.MensajeError;
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

    submitRegistroForm(){

      this.loadingRegistro = true;

      if (this.EsValidoFormularioRegistro()){

        this.usuariossvc.VerificarExistenciaCliente(this.identificacion.value).then((config: any) => {

          switch (config) {
            case 'S':

              this.errorRegistro = true;
              this.loadingRegistro = false;
              this.mensajeerroRegistro = 'Usuario ya existe';
              break;

            case 'N':

              const usrregistro = {
                identificacion: this.identificacion.value,
                nombres: this.Nombres.value,
                apellidos: this.Apellidos.value
              };

              // direccionar a suscribirse
              this.router.navigate([Crutas.Registrarse + '/' + btoa( JSON.stringify(usrregistro))]);
              break;

            default:
              this.errorRegistro = true;
              this.mensajeerroRegistro = 'Error conectando el servicio';
              break;
          }
      });

      } else{

        this.errorRegistro = true;
        this.loadingRegistro = false;

      }
    }

    EsValidoFormularioRegistro(): boolean{

        // validar que tenga identificacion
        if (this.identificacion.invalid){
          this.mensajeerroRegistro = 'Debe ingresar información valida en identificación';
          return false;
        }

        // validar que tenga nombres
        if (this.Nombres.invalid){
          this.mensajeerroRegistro = 'Debe ingresar información valida en nombres';
          return false;
        }

        // validar que tenga apellidos
        if (this.Apellidos.invalid){
          this.mensajeerroRegistro = 'Debe ingresar información valida en apellidos';
          return false;
        }

        return true;

    }

    get usuario() { return this.ingresoForm.get('usuario'); }

    get contrasena() { return this.ingresoForm.get('contrasena'); }

    get identificacion() { return this.registroForm.get('identificacion'); }

    get Nombres() { return this.registroForm.get('Nombres'); }

    get Apellidos() { return this.registroForm.get('Apellidos'); }

}
