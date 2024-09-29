import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// servicios
import { UsuarioService } from 'src/app/shared/services/usuario.service';

// Modelos
import { LoginClienteResponse } from 'src/data/modelos/seguridad/LoginClienteResponse';

// constantes
import { Crutas } from 'src/data/contantes/cRutas';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit {
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

  public ingresoForm: UntypedFormGroup;
  usuariologueado = false;
  UsrLogin: Observable<LoginClienteResponse>;
  public mensajeerror: string;
  public loading = false;
  public RutaRecuperarContrasena = Crutas.RecuperarContrasena;

  constructor(public usuariosvc: UsuarioService,
    private fb: UntypedFormBuilder,
    private router: Router
  ) {

    this.InicializarValores();
  }

  ngOnInit() {

    this.ingresoForm = this.fb.group({
      usuario: new UntypedFormControl('', Validators.compose([Validators.required])),
      contrasena: new UntypedFormControl('', Validators.compose([Validators.required])),
      recordar: new UntypedFormControl(false, [])
    });

    this.InicializarValores();

    this.EstaLogueadoUsuario();

  }

  InicializarValores() {
    this.mensajeerror = '';
  }

  submitForm(): void {
    this.loading = true;

    if (this.ingresoForm.valid) {
      this.usuariosvc.Loguin(this.ingresoForm.value)
        .then((config: any) => {
          if (!this.usuariosvc.getEstadoLoguin()) {
            this.handleLoginError(this.usuariosvc.MensajeError);
          } else {
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
  }

  EstaLogueadoUsuario() {

    this.usuariosvc.getEstadoLoguin$().subscribe((value) => {

      this.usuariologueado = value;

      this.CargarUsuario();
    });
  }

  CargarUsuario() {

    if (this.usuariologueado) {

      localStorage.setItem("isLogue", "true");
      this.UsrLogin = this.usuariosvc.getUsrLoguin();

      this.UsrLogin.subscribe((value) => {
      });
    }
  }

  CerrarSesion() {
    this.usuariosvc.loguout();
    localStorage.setItem("isLogue", "false");
  }

  get usuario() { return this.ingresoForm.get('usuario'); }

  get contrasena() { return this.ingresoForm.get('contrasena'); }

}
