import { Component, OnInit } from '@angular/core';
import {  FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';
import {  ActivatedRoute, Router,  Params } from '@angular/router';

// servicios
import { NegocioService } from '../../../../shared/services/negocio.service';
import {UsuarioService} from '../../../../shared/services/usuario.service';

// constantes
import { Crutas } from 'src/data/contantes/cRutas';

// utils
import {UtilsTexto} from 'src/app/shared/utils/UtilsTexto';

// modelos
import {CrearClienteCarroRequest} from '../../../../../data/modelos/seguridad/CrearClienteCarroRequest';
import {Mensaje} from '../../../../../data/modelos/negocio/Mensaje';
import { EstadoRespuestaMensaje } from 'src/data/contantes/cMensajes';

@Component({
  selector: 'app-page-suscribirse',
  templateUrl: './page-suscribirse.component.html',
  styleUrls: ['./page-suscribirse.component.scss']
})
export class PageSuscribirseComponent implements OnInit {

  public SuscribirseForm: FormGroup;
  public mensajerespuestaerror: string;
  public mensajerespuestaexito: string;
  public loading: boolean;
  public error = false;
  public titulo: string;
  public RutaPoliticas = Crutas.politicasPrivacidad;
  public RutaTerminos = Crutas.terminosCondiciones;
  private objCrearCliente = new CrearClienteCarroRequest();
  private MsgRespuesta = new Mensaje();
  private usuarioingresado: string;


  constructor(private fb: FormBuilder,
              private usuariossvc: UsuarioService,
              private negociosvc: NegocioService,
              private utils: UtilsTexto,
              private rutaActiva: ActivatedRoute,
              private router: Router) {

      this.usuarioingresado = atob (this.rutaActiva.snapshot.params.usrsuscribir);

      this.SetiarMensajes();

   }

  ngOnInit(): void {

    this.loading = false;

    this.SuscribirseForm = this.fb.group({
      Nombres: new FormControl('', Validators.compose([Validators.required])),
      Apellidos: new FormControl('', Validators.compose([Validators.required])),
      Identificacion: new FormControl('', Validators.compose([Validators.required])),
      Correo: new FormControl('', Validators.compose([Validators.required])),
      Telefono: new FormControl('', Validators.compose([Validators.required])),
      Usuario: new FormControl('', Validators.compose([Validators.required])),
      Contrasena: new FormControl('', Validators.compose([Validators.required])),
      recibirpromociones: new FormControl(true, []),
      aceptopoliticas: new FormControl(false, []),
     });

    this.SuscribirseForm.valueChanges.subscribe(query => {
      if (this.error){ this.error = false; }
    });

    this.titulo = this.negociosvc.configuracion.NombreCliente;

    // cargar datos quw vienen de la pantalla anterior
    const objectousr = JSON.parse(this.usuarioingresado);

    this.Identificacion.setValue(objectousr.identificacion);
    this.Nombres.setValue(objectousr.nombres);
    this.Apellidos.setValue( objectousr.apellidos);

  }

  submitForm(){

    this.loading = true;

    if (this.EsValidoFormularioRegistro()){

      this.CargarDatos();

      this.usuariossvc.CrearClienteCarroCompras(this.objCrearCliente).then((config: any) => {

        this.MsgRespuesta = config;
        this.loading = false;

        if (this.MsgRespuesta.msgId === EstadoRespuestaMensaje.Error){
          this.error = true;
          this.mensajerespuestaerror = this.MsgRespuesta.msgStr;
        }else{
          this.error = false;
          this.mensajerespuestaexito = 'Ingreso exitoso';

          // direccionar al home
          this.router.navigate(['/']);

        }

      });

    } else{

      this.error = true;
      this.loading = false;

    }

  }

  EsValidoFormularioRegistro(): boolean{

    if (this.Nombres.invalid){
      this.mensajerespuestaerror = 'Debe ingresar información valida en Nombres';
      return false;
    }

    if (this.Apellidos.invalid){
      this.mensajerespuestaerror = 'Debe ingresar información valida en Apellidos';
      return false;
    }

    if (this.Identificacion.invalid){
      this.mensajerespuestaerror = 'Debe ingresar información valida en identificación';
      return false;
    }

    if (this.Correo.invalid){
      this.mensajerespuestaerror = 'Debe ingresar información valida en Correo Electrónico';
      return false;
    }

    if (this.Telefono.invalid){
      this.mensajerespuestaerror = 'Debe ingresar información valida en Telefono';
      return false;
    }

    if (this.Usuario.invalid){
      this.mensajerespuestaerror = 'Debe ingresar información valida en Usuario';
      return false;
    }

    if (this.Contrasena.invalid){
      this.mensajerespuestaerror = 'Debe ingresar información valida en Contrasena';
      return false;
    }

    // validar Terminos y condiciones
    if (this.aceptopoliticas.value === false){
      this.mensajerespuestaerror = 'Debe aceptar terminos y condiciones';
      return false;
    }

    if (!this.utils.EsCorreoValido(this.Correo.value) ){
      this.mensajerespuestaerror = 'El Correo Electrónico es invalido';
      return false;
    }

    return true;

  }

  SetiarMensajes(){
    this.mensajerespuestaexito = '';
    this.mensajerespuestaerror = '';
  }

  CargarDatos(){

    this.objCrearCliente.Nombres = this.Nombres.value;
    this.objCrearCliente.Apellidos = this.Apellidos.value;
    this.objCrearCliente.Identificacion = this.Identificacion.value;
    this.objCrearCliente.Correo = this.Correo.value;
    this.objCrearCliente.Telefono = this.Telefono.value;
    this.objCrearCliente.Usuario = this.Usuario.value;
    this.objCrearCliente.Contrasena = this.Contrasena.value;
    this.objCrearCliente.Promociones = '1';
    this.objCrearCliente.Politicas = '1';

  }

  get Identificacion() { return this.SuscribirseForm.get('Identificacion'); }
  get Nombres() { return this.SuscribirseForm.get('Nombres'); }
  get Apellidos() { return this.SuscribirseForm.get('Apellidos'); }
  get Correo() { return this.SuscribirseForm.get('Correo'); }
  get Telefono() { return this.SuscribirseForm.get('Telefono'); }
  get Usuario() { return this.SuscribirseForm.get('Usuario'); }
  get Contrasena() { return this.SuscribirseForm.get('Contrasena'); }
  get recibirpromociones() { return this.SuscribirseForm.get('recibirpromociones'); }
  get aceptopoliticas() { return this.SuscribirseForm.get('aceptopoliticas'); }


}
