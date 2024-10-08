import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// servicios
import { NegocioService } from '../../../../shared/services/negocio.service';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { Mensaje } from '../../../../../data/modelos/negocio/Mensaje';
import { CrearClienteCarroRequest } from '../../../../../data/modelos/seguridad/CrearClienteCarroRequest';
import { CrearClienteCarroRequestv1 } from '../../../../../data/modelos/seguridad/CrearClienteV1CarroRequest';
import { EstadoRespuestaMensaje } from '../../../../../data/contantes/cMensajes';
import { Crutas } from '../../../../../data/contantes/cRutas';
import { StoreService } from '../../../../shared/services/store.service';
import { UtilsTexto } from '../../../../shared/utils/UtilsTexto';

@Component({
  selector: 'app-page-suscribirse',
  templateUrl: './page-suscribirse.component.html',
  styleUrls: ['./page-suscribirse.component.scss']
})
export class PageSuscribirseComponent implements OnInit {

  public SuscribirseForm: UntypedFormGroup;
  public mensajerespuestaerror: string;
  public mensajerespuestaexito: string;
  public loading: boolean;
  public error = false;
  public titulo: string;
  public RutaPoliticas = Crutas.politicasPrivacidad;
  public RutaTerminos = Crutas.terminosCondiciones;
  private objCrearCliente = new CrearClienteCarroRequest();
  private objCrearClientev1 = new CrearClienteCarroRequestv1();
  private MsgRespuesta = new Mensaje();
  private usuarioingresado: string;
  private clienteDirecto: boolean = false;


  constructor(private fb: UntypedFormBuilder,
    private usuariossvc: UsuarioService,
    private negociosvc: NegocioService,
    private utils: UtilsTexto,
    private rutaActiva: ActivatedRoute,
    public storeSvc: StoreService,
    private router: Router) {

    //this.usuarioingresado = atob (this.rutaActiva.snapshot.params.usrsuscribir);

    this.SetiarMensajes();

  }

  ngOnInit(): void {

    this.loading = false;


    this.SuscribirseForm = this.fb.group({
      tipo: new UntypedFormControl('', Validators.compose([Validators.required])),
      Nombres: new UntypedFormControl('', Validators.compose([Validators.required])),
      Apellidos: new UntypedFormControl('', Validators.compose([Validators.required])),
      RazonSocial: new UntypedFormControl(''),
      Identificacion: new UntypedFormControl('', Validators.compose([Validators.required])),
      Correo: new UntypedFormControl('', Validators.compose([Validators.required])),
      Telefono: new UntypedFormControl('', Validators.compose([Validators.required])),
      Usuario: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      Contrasena: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      recibirpromociones: new UntypedFormControl(true, []),
      aceptopoliticas: new UntypedFormControl(false, []),
    });

    this.SuscribirseForm.valueChanges.subscribe(query => {
      if (this.error) { this.error = false; }
    });

    this.titulo = this.negociosvc.configuracion.NombreCliente;

    // cargar datos quw vienen de la pantalla anterior
    const objectousr = JSON.parse(this.usuarioingresado);
    this.tipo.setValue(objectousr.tipo)
    this.Identificacion.setValue(objectousr.identificacion);
    this.Nombres.setValue(objectousr.nombres);
    this.Apellidos.setValue(objectousr.apellidos);
    
    this.clienteDirecto = this.storeSvc.configuracionSitio.CreacionDirectaClientes;

  }

  submitForm() {

    this.loading = true;
    this.SetiarMensajes();

    if (this.EsValidoFormularioRegistro()) {

      if(!this.clienteDirecto) {
        this.CargarDatos();

      } else {
        this.CargarDatosv1();
      }


      this.manejarCreacionCliente()

    } else {

      this.error = true;
      this.loading = false;

    }

  }


  async manejarCreacionCliente() {
    try {
      const config = !this.clienteDirecto
        ? await this.usuariossvc.CrearEditarClienteV1(this.objCrearClientev1)
        : await this.usuariossvc.CrearClienteCarroCompras(this.objCrearCliente);

      this.MsgRespuesta = config;
      this.loading = false;
      this.error = this.MsgRespuesta.msgId === EstadoRespuestaMensaje.Error;
      this.mensajerespuestaerror = this.error ? this.MsgRespuesta.msgStr : '';
      this.mensajerespuestaexito = this.error ? '' : 'Ingreso exitoso';
      this.router.navigate(['/']);
    } catch (error) {
      // Manejar el error en caso de que ocurra
      console.error(error);
    }
  }
  EsValidoFormularioRegistro(): boolean {
    // Validaciones específicas según el tipo de identificación
    if (this.tipo.value === 'CEDULA') {
      if (this.Nombres.invalid) {
        this.mensajerespuestaerror = 'Debe ingresar información válida en Nombres';
        return false;
      }
      if (this.Apellidos.invalid) {
        this.mensajerespuestaerror = 'Debe ingresar información válida en Apellidos';
        return false;
      }
    } else if (this.tipo.value === 'NIT') {
      if (this.RazonSocial.invalid) {
        this.mensajerespuestaerror = 'Debe ingresar información válida en Razón Social';
        return false;
      }
    }

    // Validaciones generales
    if (this.tipo.invalid) {
      this.mensajerespuestaerror = 'Debe ingresar información válida en tipo de identificación';
      return false;
    }
    if (this.Identificacion.invalid) {
      this.mensajerespuestaerror = 'Debe ingresar información válida en identificación';
      return false;
    }
    if (this.Correo.invalid) {
      this.mensajerespuestaerror = 'Debe ingresar información válida en Correo Electrónico';
      return false;
    }
    if (this.Telefono.invalid) {
      this.mensajerespuestaerror = 'Debe ingresar información válida en Teléfono';
      return false;
    }
    if (this.Usuario.invalid) {
      this.mensajerespuestaerror = 'Debe ingresar información válida en Usuario';
      return false;
    }
    if (this.Contrasena.invalid) {
      this.mensajerespuestaerror = 'Debe ingresar información válida en Contraseña';
      return false;
    }
    if (this.aceptopoliticas.value === false) {
      this.mensajerespuestaerror = 'Debe aceptar términos y condiciones';
      return false;
    }
    if (!this.utils.EsCorreoValido(this.Correo.value)) {
      this.mensajerespuestaerror = 'El Correo Electrónico es inválido';
      return false;
    }
    return true;
  }

  SetiarMensajes() {
    this.mensajerespuestaexito = '';
    this.mensajerespuestaerror = '';
  }

  CargarDatos() {
    this.objCrearCliente.tipoIdentificacion = this.tipo.value;
    this.objCrearCliente.Nombres = this.tipo.value == 'CEDULA' ? this.Nombres.value : this.RazonSocial.value;
    this.objCrearCliente.Apellidos = this.tipo.value == 'CEDULA' ? this.Apellidos.value : '';
    this.objCrearCliente.Identificacion = this.Identificacion.value;
    this.objCrearCliente.Correo = this.Correo.value;
    this.objCrearCliente.Telefono = this.Telefono.value;
    this.objCrearCliente.Usuario = this.Usuario.value;
    this.objCrearCliente.Contrasena = this.Contrasena.value;
    this.objCrearCliente.Promociones = '1';
    this.objCrearCliente.Politicas = '1';

  }

  CargarDatosv1() {
    this.objCrearClientev1.mail = this.Correo.value;
    this.objCrearClientev1.tel = this.Telefono.value;
    this.objCrearClientev1.idTpdoc = this.tipo.value
    this.objCrearClientev1.nmbCmn = this.Nombres.value
    this.objCrearClientev1.aplCtt = this.Apellidos.value;
  }

  onTipoChange(): void {
    const tipoValue = this.tipo.value;
    if (tipoValue === 'CEDULA') {
      this.SuscribirseForm.get('Nombres').setValidators([Validators.required]);
      this.SuscribirseForm.get('Apellidos').setValidators([Validators.required]);
      this.SuscribirseForm.get('RazonSocial').clearValidators();
    } else if (tipoValue === 'NIT') {
      this.SuscribirseForm.get('Nombres').clearValidators();
      this.SuscribirseForm.get('Apellidos').clearValidators();
      this.SuscribirseForm.get('RazonSocial').setValidators([Validators.required]);
    }
    this.SuscribirseForm.get('Nombres').updateValueAndValidity();
    this.SuscribirseForm.get('Apellidos').updateValueAndValidity();
    this.SuscribirseForm.get('RazonSocial').updateValueAndValidity();
  }

  get tipo() { return this.SuscribirseForm.get('tipo'); }
  get Identificacion() { return this.SuscribirseForm.get('Identificacion'); }
  get Nombres() { return this.SuscribirseForm.get('Nombres'); }
  get Apellidos() { return this.SuscribirseForm.get('Apellidos'); }
  get Correo() { return this.SuscribirseForm.get('Correo'); }
  get Telefono() { return this.SuscribirseForm.get('Telefono'); }
  get Usuario() { return this.SuscribirseForm.get('Usuario'); }
  get Contrasena() { return this.SuscribirseForm.get('Contrasena'); }
  get recibirpromociones() { return this.SuscribirseForm.get('recibirpromociones'); }
  get aceptopoliticas() { return this.SuscribirseForm.get('aceptopoliticas'); }
  get RazonSocial() { return this.SuscribirseForm.get('RazonSocial'); }


}
