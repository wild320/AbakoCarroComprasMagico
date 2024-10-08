import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';

// servicios
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { Crutas } from '../../../../../data/contantes/cRutas';

// constantes

@Component({
  selector: 'app-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit {

  public ingresoForm: UntypedFormGroup;
  public registroForm: UntypedFormGroup;
  public error = false;
  public errorRegistro = false;
  public mensajeerror: string;
  public mensajeerroRegistro: string;
  public loading = false;
  public loadingRegistro = false;
  public RutaRecuperarContrasena = Crutas.RecuperarContrasena;

  constructor(
    private fb: UntypedFormBuilder,
    private usuariossvc: UsuarioService,
    private router: Router) {

  }

  ngOnInit() {

    this.ingresoForm = this.fb.group({
      usuario: new UntypedFormControl('', Validators.compose([Validators.required])),
      contrasena: new UntypedFormControl('', Validators.compose([Validators.required])),
      recordar: new UntypedFormControl(false, [])
    });

    // this.registroForm = this.fb.group({
    //   tipo: new UntypedFormControl('', Validators.compose([Validators.required])),
    //   identificacion: new UntypedFormControl('', Validators.compose([Validators.required])),
    //   Nombres: new UntypedFormControl('', Validators.compose([Validators.required])),
    //   Apellidos: new UntypedFormControl('', Validators.compose([Validators.required])),
    // });

    this.ingresoForm.valueChanges.subscribe(query => {
      if (this.error) { this.error = false; }
    });

    // this.registroForm.valueChanges.subscribe(query => {
    //   if (this.errorRegistro) { this.errorRegistro = false; }
    // });

  }

  submitForm(): void {
    this.loading = true;
  
    if (this.ingresoForm.valid) {
      this.usuariossvc.Loguin(this.ingresoForm.value)
        .then((config: any) => {
          if (!this.usuariossvc.getEstadoLoguin()) {
            this.handleLoginError(this.usuariossvc.MensajeError);
          } else {
            this.error = false;
            this.router.navigate(['/']);
          }
          this.loading = false;
        })
        .catch((err: any) => {
          this.handleLoginError('Error al intentar loguear. Por favor intente nuevamente.');
          console.error('Login error:', err);
          this.loading = false;
        });
    } else {
      this.handleFormErrors();
      this.loading = false;
    }
  }
  
  private handleLoginError(mensaje: string): void {
    this.mensajeerror = mensaje;
    this.error = true;
  }
  
  private handleFormErrors(): void {
    const formErrors: string[] = [];
    
    if (this.contrasena.invalid) {
      formErrors.push('Debe ingresar información válida en contraseña.');
    }
  
    if (this.usuario.invalid) {
      formErrors.push('Debe ingresar información válida en usuario.');
    }
  
    this.mensajeerror = formErrors.join(' ');
    this.error = true;
  }
  

  // submitRegistroForm() {

  //   this.loadingRegistro = true;

  //   if (this.EsValidoFormularioRegistro()) {

  //     this.usuariossvc.VerificarExistenciaCliente(this.identificacion.value).then((config: any) => {

  //       switch (config) {
  //         case 'S':

  //           this.errorRegistro = true;
  //           this.loadingRegistro = false;
  //           this.mensajeerroRegistro = 'Usuario ya existe';
  //           break;

  //         case 'N':

  //           const usrregistro = {
  //             tipo: this.tipo.value,
  //             identificacion: this.identificacion.value,
  //             nombres: this.Nombres.value,
  //             apellidos: this.Apellidos.value
  //           };

  //           // direccionar a suscribirse
  //           this.router.navigate([Crutas.Registrarse + '/' + btoa(JSON.stringify(usrregistro))]);
  //           break;

  //         default:
  //           this.errorRegistro = true;
  //           this.mensajeerroRegistro = 'Error conectando el servicio';
  //           break;
  //       }
  //     });

  //   } else {

  //     this.errorRegistro = true;
  //     this.loadingRegistro = false;

  //   }
  // }

  // EsValidoFormularioRegistro(): boolean {
  //   if (this.tipo.invalid) {
  //     this.mensajeerroRegistro = 'Debe ingresar información valida en tipo de identificación';
  //     return false;
  //   }

  //   // validar que tenga identificacion
  //   if (this.identificacion.invalid) {
  //     this.mensajeerroRegistro = 'Debe ingresar información valida en identificación';
  //     return false;
  //   }

  //   // validar que tenga nombres
  //   if (this.Nombres.invalid) {
  //     this.mensajeerroRegistro = 'Debe ingresar información valida en nombres';
  //     return false;
  //   }

  //   // validar que tenga apellidos
  //   if (this.Apellidos.invalid) {
  //     this.mensajeerroRegistro = 'Debe ingresar información valida en apellidos';
  //     return false;
  //   }

  //   return true;

  // }


  // get tipo() { return this.registroForm.get('tipo'); }

  get usuario() { return this.ingresoForm.get('usuario'); }

  get contrasena() { return this.ingresoForm.get('contrasena'); }

  // get identificacion() { return this.registroForm.get('identificacion'); }

  // get Nombres() { return this.registroForm.get('Nombres'); }

  // get Apellidos() { return this.registroForm.get('Apellidos'); }

}
