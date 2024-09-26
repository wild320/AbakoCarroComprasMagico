import { Component, OnInit } from '@angular/core';
import {  UntypedFormGroup , UntypedFormBuilder, Validators , UntypedFormControl} from '@angular/forms';
import {  Router } from '@angular/router';

// servicios
import {UsuarioService} from '../../../../shared/services/usuario.service';

// utils
import {UtilsTexto} from '../../../../shared/utils/UtilsTexto';

// constantes
import { Crutas } from '../../../../../data/contantes/cRutas';
import { EstadoRespuestaMensaje } from '../../../../../data/contantes/cMensajes';

// modelos
import {EnviarUsuarioRequest} from '../../../../../data/modelos/seguridad/EnviarUsuarioRequest';

@Component({
  selector: 'app-page-recuperar-contrasena',
  templateUrl: './page-recuperar-contrasena.component.html',
  styleUrls: ['./page-recuperar-contrasena.component.scss']
})
export class PageRecuperarContrasenaComponent implements OnInit {

  public RecuperarForm: UntypedFormGroup;
  public mensajerespuestaerror: string;
  public mensajerespuestaexito: string;
  public loading: boolean;
  public loadingEnviado: boolean;
  public error = false;
  public CodigoEnviado = false;
  public CodigoGenerado = false;
  private EnviarUsuario = new EnviarUsuarioRequest();


  constructor(private fb: UntypedFormBuilder,
              private usuariossvc: UsuarioService,
              private utils: UtilsTexto,
              private router: Router) {

    this.SetiarMensajes();

  }

  ngOnInit(): void {

    this.loading = false;
    this.loadingEnviado = false;

    this.RecuperarForm = this.fb.group({
      Correo: new UntypedFormControl('', Validators.compose([Validators.required])),
      Identificacion: new UntypedFormControl('', Validators.compose([Validators.required])),
      CodigoSeguridad: new UntypedFormControl('', Validators.compose([Validators.required]))

    });

  }

  submitForm(){

    this.loading = true;
    this.SetiarMensajes();

    if (this.EsValidoFormularioRegistro()){

      if (this.CodigoEnviado){

        if (this.CodigoSeguridad.value === this.usuariossvc.RecuperarUsuario.codigoSeguridad ){

          this.loadingEnviado = true;

          this.EnviarUsuario.Correo = this.Correo.value;
          this.EnviarUsuario.IdPersona = this.usuariossvc.RecuperarUsuario.idPersona;
          this.EnviarUsuario.Plataforma = 'Carro de Compras';

          this.usuariossvc.EnviarUsuarioGenerado(this.EnviarUsuario).then((config: any) => {

            if (config.msgId === EstadoRespuestaMensaje.Error){

              this.mensajerespuestaerror  = config.msgStr;

            }else{

              this.CodigoGenerado = true;
            }

            this.loadingEnviado = false;

          });

        }else{
          this.mensajerespuestaerror  = 'Código ingresado no coincide con el código generado';
        }

        this.loading = false;

      }else{

        this.usuariossvc.GenerarCodigoUsurio(this.Correo.value, this.Identificacion.value).then((config: any) => {

          if (config.msgId === EstadoRespuestaMensaje.Error){

            this.mensajerespuestaerror  = config.msgStr;

          }else{

            this.CodigoEnviado = true;
          }

          this.loading = false;

        });

      }
    }
  }

  IrUsuarioClick(){
    // direccionar a suscribirse
    this.router.navigate([Crutas.loguin]);
  }

  EsValidoFormularioRegistro(): boolean{

    if (this.CodigoEnviado){

      if (this.CodigoSeguridad.invalid){
        this.mensajerespuestaerror = 'Debe ingresar el código de seguridad';
        return false;
      }

    }else{

      if (this.Correo.invalid){
        this.mensajerespuestaerror = 'Debe ingresar información valida en Correo Electrónico';
        return false;
      }

      if (!this.utils.EsCorreoValido(this.Correo.value) ){
        this.mensajerespuestaerror = 'El Correo Electrónico es invalido';
        return false;
      }

      if (this.Identificacion.invalid){
        this.mensajerespuestaerror = 'Debe ingresar información valida en Identificación';
        return false;
      }

    }

    return true;

  }

  SetiarMensajes(){
    this.mensajerespuestaexito = '';
    this.mensajerespuestaerror = '';
  }

  get Correo() { return this.RecuperarForm.get('Correo'); }
  get CodigoSeguridad() { return this.RecuperarForm.get('CodigoSeguridad'); }
  get Identificacion() { return this.RecuperarForm.get('Identificacion'); }

}
