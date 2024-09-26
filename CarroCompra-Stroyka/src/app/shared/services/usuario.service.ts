import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';


// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { ServiceHelper } from '../services/ServiceHelper';
import { LocalService } from '../services/local-service.service';

// interfaces
import { Address } from '../interfaces/address';

// modelos
import { VerificarExistenciaClienteRequest } from '../../../data/modelos/negocio/VerificarExistenciaCliente';
import {CrearClienteCarroRequest} from '../../../data/modelos/seguridad/CrearClienteCarroRequest';
import {CrearClienteCarroRequestv1} from '../../../data/modelos/seguridad/CrearClienteV1CarroRequest';
import {UsuarioStorage} from '../../../data/modelos/seguridad/UsuarioStorage';
import {Mensaje} from '../../../data/modelos/negocio/Mensaje';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { EstadoRespuestaMensaje } from '../../../data/contantes/cMensajes';
import { cOperaciones } from '../../../data/contantes/COperaciones';


// modelos
import {LoguinRequest} from '../../../data/modelos/seguridad/LoguinRequest';
import {LoginClienteResponse} from '../../../data/modelos/seguridad/LoginClienteResponse';
import {CRUDPersonaExistenteRequest} from '../../../data/modelos/seguridad/CRUDPersonaExistenteRequest';
import {MaestrosLocalizacionResponse} from '../../../data/modelos/negocio/MaestrosLocalizacionResponse';
import {MaestrosLocalizacionRequest} from '../../../data/modelos/negocio/MaestrosLocalizacionRequest';
import {RecuperarUsuarioResponse} from '../../../data/modelos/seguridad/RecuperarUsuarioResponse';
import {EnviarUsuarioRequest} from '../../../data/modelos/seguridad/EnviarUsuarioRequest';
import { Persona } from '../../../data/modelos/seguridad/CRUDPersonaExistente';
import { MaestroCiudad } from '../../../data/modelos/negocio/Ciudades';
import { GuardarDireccion } from '../../../data/modelos/negocio/GuardarDireccion';
import { StoreService } from './store.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private UrlServicioLoguin: string;
  private UrlServicioLocalizacion: string;
  private UsrLogin$ = new Subject<LoginClienteResponse>();
  private DireccionesCargadas$: BehaviorSubject<boolean>;
  private UsuarioLogueado$: BehaviorSubject<boolean>;
  private UsuarioLogueado: false;
  private VerificarExistencia = new VerificarExistenciaClienteRequest();
  private usuarioStorage = new UsuarioStorage();
  private MsgRespuesta = new Mensaje();
  public addresses: Address[];
  public departamentos: string[];
  public ciudad: MaestroCiudad[];
  public DatosPersona = new Persona();
  public DatosPersonaRequest = new CRUDPersonaExistenteRequest();
  public objMaestrosLocalizacion = new MaestrosLocalizacionResponse();
  public MaestrosLocalizacionRequest = new MaestrosLocalizacionRequest();
  public RecuperarUsuario = new RecuperarUsuarioResponse();
  public Idempresa: number;
  public IdPersona: number;
  public cedula: any;
  MensajeError = '';
  recordar = false;
  private token = 'token';
  public razonsocial: string;
  public correo: string;
  public UsrLogin: LoginClienteResponse;

  constructor(
        private servicehelper: ServiceHelper<any, any>,
        private negocio: NegocioService,
        private httpClient: HttpClient,
        private localService: LocalService,
        @Inject(PLATFORM_ID) private platformId: Object,
        ) {

        this.UsuarioLogueado$ = new BehaviorSubject<boolean>(false);
        this.DireccionesCargadas$ = new BehaviorSubject<boolean>(false);
        this.addresses = [];

        // tslint:disable-next-line: deprecation
        this.getEstadoLoguin$().subscribe(value => {});


  }


  setdireccionesCargadas$(newValue): void {
    this.DireccionesCargadas$.next(newValue);
  }

  getDireccionesCargadas$(): Observable<boolean> {
    return this.DireccionesCargadas$.asObservable();
  }


  setEstadoLoguin$(newValue): void {
    this.UsuarioLogueado = newValue;
    this.UsuarioLogueado$.next(newValue);
  }

  getEstadoLoguin(){
    return this.UsuarioLogueado;
  }

  getEstadoLoguin$(): Observable<boolean> {
    return this.UsuarioLogueado$.asObservable();
  }

  setUsrLoguin(usuario: LoginClienteResponse) {
    this.UsrLogin$.next(usuario);
  }

  getUsrLoguin(): Observable<LoginClienteResponse> {
    return this.UsrLogin$.asObservable();
  }

  private CRUDPersonaExistente(accion: string, persona: Persona ): Promise<void> {
    this.UrlServicioLoguin =
        this.negocio.configuracion.UrlServicioAdministracion +
        CServicios.ApiAdministracion +
        CServicios.ServivioCRUDPersonaExistente;

    // cargar los datos del usaurios
    this.DatosPersonaRequest.accion = accion;
    this.DatosPersonaRequest.idPersona = this.IdPersona;
    this.DatosPersonaRequest.persona = persona;

    return this.servicehelper
      .PostData(this.UrlServicioLoguin, this.DatosPersonaRequest)
      .toPromise()
      .then((config: any) => {

        this.DatosPersona = config;

        return config;

      })
      .catch((err: any) => {

          this.DatosPersona.estado[0].msgId = EstadoRespuestaMensaje.Error;
          this.DatosPersona.estado[0].msgStr = 'Error conectando el api: ' + err;

          return this.DatosPersona;

      });
  }

  private MaestrosLocalizacion(): Promise<void> {
    this.UrlServicioLocalizacion =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiNegocio +
        CServicios.ServivioMaestrosLocalizacion;

    // cargar los datos del usaurios
    this.MaestrosLocalizacionRequest.fecha = '2020-01-01';
    this.MaestrosLocalizacionRequest.idPersona = this.IdPersona;
    this.MaestrosLocalizacionRequest.esTodo = 'S';

    return this.servicehelper
      .PostData(this.UrlServicioLocalizacion, this.MaestrosLocalizacionRequest)
      .toPromise()
      .then((config: any) => {

        this.objMaestrosLocalizacion = config;

        // organizar departamentos y ciudades
        this.departamentos = [];
        this.ciudad = [];

        this.objMaestrosLocalizacion.barrios.forEach((value) => {

          // departamentos
          if (this.departamentos.indexOf(value.departamento.toUpperCase()) === -1){
            this.departamentos.push(value.departamento.toUpperCase());
          }

          // ciudades
          if (this.ciudad.findIndex(obj => obj.ciudad === value.ciudad && obj.departamento === value.departamento  ) === -1){
            this.ciudad.push({ciudad: value.ciudad.toUpperCase(), departamento: value.departamento.toUpperCase()});
          }

          this.departamentos.sort();

          // ordenar prefijos
          this.ciudad.sort((o1, o2) => {
            if (o1.ciudad > o2.ciudad) { // comparación lexicogŕafica
              return 1;
            } else if (o1.ciudad < o2.ciudad) {
              return -1;
            }
            return 0;
          });

          // ordenar prefijos
          this.objMaestrosLocalizacion.barrios.sort((o1, o2) => {
            if (o1.barrio > o2.barrio) { // comparación lexicogŕafica
              return 1;
            } else if (o1.barrio < o2.barrio) {
              return -1;
            }
            return 0;
          });

          // ordenar prefijos
          this.objMaestrosLocalizacion.prefijos.sort((o1, o2) => {
            if (o1.prefijo > o2.prefijo) { // comparación lexicogŕafica
              return 1;
            } else if (o1.prefijo < o2.prefijo) {
              return -1;
            }
            return 0;
          });


        });

        return config;

      })
      .catch((err: any) => {

        this.objMaestrosLocalizacion.msgId = EstadoRespuestaMensaje.Error;
        this.objMaestrosLocalizacion.msgStr = 'Error conectando el api: ' + err;

        return this.objMaestrosLocalizacion;

      });
  }

  Loguin(usrrq: LoguinRequest) {
    this.UrlServicioLoguin =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiNegocio +
        CServicios.ServivioLoguinCLiente;

    this.recordar     = usrrq.recordar;
    this.MensajeError = '';

    return this.servicehelper
        .PostData(this.UrlServicioLoguin, usrrq)
        .toPromise()
        .then((config: any) => {

            this.cargarRespuesta(config, usrrq);

            if (this.MensajeError.length === 0){
              if(!this.recordar ){
                this.localService.setJsonValueSession(this.token, this.usuarioStorage);
              }

              this.MsgRespuesta.msgId = EstadoRespuestaMensaje.exitoso;
              this.MsgRespuesta.msgStr = 'Usuario exitoso';
        // cambiar estado de logueado
              this.setEstadoLoguin$(true);

              return this.MsgRespuesta;
            }

            this.MsgRespuesta.msgId = EstadoRespuestaMensaje.Error;
            this.MsgRespuesta.msgStr = this.MensajeError;

            this.setEstadoLoguin$(false);

            return this.MsgRespuesta;


        })
        .catch((err: any) => {

          this.MsgRespuesta.msgId = EstadoRespuestaMensaje.Error;
          this.MsgRespuesta.msgStr = 'Error al consumir servicio:' + err.message;

          return this.MsgRespuesta;
        });

  }

  VerificarExistenciaCliente(identificacion: string) {
    this.UrlServicioLoguin =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiNegocio +
        CServicios.ServivioExistenciaCLiente;

    // carga datos
    this.VerificarExistencia.identificacion = identificacion;

    return this.httpClient.get(this.UrlServicioLoguin + '/' + identificacion.toString(), { responseType: 'text' })
        .toPromise()
        .then((config: any) => {
            return config;
        })
        .catch((err: any) => {
          console.error(err.message);
          return err.message;
        });

  }

  GenerarCodigoUsurio(correo: string, identificacion: string) {
    this.UrlServicioLoguin =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiNegocio +
        CServicios.ServivioRecuperarCodigoSeguridad;

    return this.httpClient.get(this.UrlServicioLoguin + '/' + correo.toString() + '/' + identificacion.toString(), { responseType: 'text' })
        .toPromise()
        .then((config: any) => {

          this.RecuperarUsuario = JSON.parse(config);

          return this.RecuperarUsuario.estado;
        })
        .catch((err: any) => {

          this.MsgRespuesta.msgId = EstadoRespuestaMensaje.Error;
          this.MsgRespuesta.msgStr = 'Error al consumir servicio:' + err.message;

          return this.MsgRespuesta;
        });

  }


  CrearClienteCarroCompras(request: CrearClienteCarroRequest ){

    this.UrlServicioLoguin =
    this.negocio.configuracion.UrlServicioAdministracion + CServicios.ApiAdministracion + CServicios.ServivioCrearCliente;


    return this.servicehelper
        .PostData(this.UrlServicioLoguin, request)
        .toPromise()
        .then((config: any) => {

            this.MsgRespuesta = config.mensaje;

            // cargar datos del usuarios
            if (this.MsgRespuesta.msgId === EstadoRespuestaMensaje.exitoso){

              const logueo = new LoguinRequest();

              logueo.usuario = request.Usuario;
              logueo.contrasena = request.Contrasena;
              logueo.recordar = true;

              this.Loguin(logueo).then((configlogueo: any) => {
                return this.MsgRespuesta;
              });

            }

            return this.MsgRespuesta;

        })
        .catch((err: any) => {

          this.MsgRespuesta.msgId = EstadoRespuestaMensaje.Error;
          this.MsgRespuesta.msgStr = 'Error al consumir servicio:' + err.message;

          return this.MsgRespuesta;

        });

  }


  CrearEditarClienteV1(request: CrearClienteCarroRequestv1){

    this.UrlServicioLoguin =
    this.negocio.configuracion.UrlServicioAdministracion + CServicios.ApiAdministracion + CServicios.ServivioCrearEditarClienteV1;


    return this.servicehelper
        .PostData(this.UrlServicioLoguin, request)
        .toPromise()
        .then((config: any) => {

            this.MsgRespuesta = config.mensaje;

            return this.MsgRespuesta;

        })
        .catch((err: any) => {

          this.MsgRespuesta.msgId = EstadoRespuestaMensaje.Error;
          this.MsgRespuesta.msgStr = 'Error al consumir servicio:' + err.message;

          return this.MsgRespuesta;

        });

  }
  EnviarUsuarioGenerado(request: EnviarUsuarioRequest ){

    this.UrlServicioLoguin =
    this.negocio.configuracion.UrlServicioCarroCompras +
    CServicios.ApiNegocio +
    CServicios.ServivioEnviarUsuarioGenerado;

    return this.servicehelper
        .PostData(this.UrlServicioLoguin, request)
        .toPromise()
        .then((config: any) => {

            return config;

        })
        .catch((err: any) => {

          this.MsgRespuesta.msgId = EstadoRespuestaMensaje.Error;
          this.MsgRespuesta.msgStr = 'Error al consumir servicio:' + err.message;

          return this.MsgRespuesta;

        });

  }

  GuardarActualizarUsuario(Nombres: string, Apellidos: string, Identificacion: string, Correo: string, telefono: string ){

    // cambiar datos del objecto
    this.DatosPersona.nombres = Nombres;
    this.DatosPersona.apellidos = Apellidos;
    this.DatosPersona.identificacion = Identificacion;

    // datos de empresa
    const nombrecompleto = Nombres.toUpperCase() + ' ' + Apellidos.toUpperCase() ;

    this.DatosPersona.empresaUsuario[0].identificacion = Identificacion;
    this.DatosPersona.empresaUsuario[0].nombre_Comun = nombrecompleto;
    this.DatosPersona.empresaUsuario[0].razon_Social = nombrecompleto;

    // Correo
    this.ActualizarCorreo(Correo);

    // Telefono
    this.ActualizarTelefono (telefono);


    return this.CRUDPersonaExistente('UPD', this.DatosPersona).then((ret: any) => {

      // actualizar datos de loguin
      this.UsrLogin.usuario[0].Apll = Apellidos.toUpperCase();
      this.UsrLogin.usuario[0].idnt = Identificacion;
      this.UsrLogin.usuario[0].mail = Correo;
      this.UsrLogin.usuario[0].nmb = Nombres;
      this.UsrLogin.usuario[0].NmbCmn = nombrecompleto;
      this.UsrLogin.usuario[0].Nmbr = Nombres.toUpperCase();
      this.UsrLogin.usuario[0].RScl = nombrecompleto;
      this.UsrLogin.usuario[0].Tel = telefono;

      // otro datos
      this.razonsocial = nombrecompleto;
      this.correo = Correo;
      this.addresses[0].nombres = Nombres.toUpperCase();
      this.addresses[0].apellidos = Apellidos.toUpperCase();
      this.addresses[0].telefono = telefono;
      this.addresses[0].correo  = Correo;

      // actualizar el id de telefono
      this.DatosPersona.dllTelefono[0].idTelefono =  ret.dllTelefono[0].idTelefono;
      this.DatosPersona.dllMail[0].idMail = ret.dllMail[0].idMail;

      return ret;

    });

  }

  async CargarMaestrosLocalizacion(){

    if (this.objMaestrosLocalizacion.barrios === undefined){
      return await this.MaestrosLocalizacion().then((ret: any) => { });
    }

  }

  GuardarActualizarContrasena(Contrasena: string ){

    // cambiar datos del objecto
    this.DatosPersona.dllUsuario[0].contrasena = Contrasena;

    return this.CRUDPersonaExistente('UPD', this.DatosPersona).then((ret: any) => {

      if (this.getEstadoLoguin()){

        // actualizamos datos del storage
        let UsuarioSesion = new LoguinRequest();
        UsuarioSesion = this.localService.getJsonValue(this.token);
        UsuarioSesion.contrasena = Contrasena;

        this.guardarStorage(UsuarioSesion, this.DatosPersona.empresaUsuario.idEmpresa, this.DatosPersona.idPersona, this.DatosPersona.identificacion );

      }

      return ret;

    });

  }

  GuardarActualizarDireccion(objGuardar: GuardarDireccion ){

    // cambiar datos del objecto
    if (objGuardar.Id > 0){

      const index = this.DatosPersona.dllDireccion.findIndex( x => x.idDireccion === objGuardar.Id);

      if (index >= 0){

        this.DatosPersona.dllDireccion[0].idBarrio = objGuardar.Barrio;
        this.DatosPersona.dllDireccion[0].idPrefijoDireccionUno = objGuardar.Prefijo;
        this.DatosPersona.dllDireccion[0].parteUno = objGuardar.CalleCarrera;
        this.DatosPersona.dllDireccion[0].parteDos = objGuardar.Direccion;
        this.DatosPersona.dllDireccion[0].parteTres = objGuardar.Interior;
        this.DatosPersona.dllDireccion[0].codigoPostal = objGuardar.CodigoPostal;
        this.DatosPersona.dllDireccion[0].operacion = cOperaciones.Actualizar;
        this.DatosPersona.dllDireccion[0].barrio = objGuardar.Strbarrio;
        this.DatosPersona.dllDireccion[0].ciudad = objGuardar.ciudad;
        this.DatosPersona.dllDireccion[0].departamento = objGuardar.departamento;
        this.DatosPersona.dllDireccion[0].pais = objGuardar.pais;
        this.DatosPersona.dllDireccion[0].direccion = objGuardar.direccion;

      }

    }else{

       this.DatosPersona.dllDireccion
       .push({idDireccion: 0 , idTipoDireccion: 1,  idBarrio: objGuardar.Barrio, idEstrato: 1,
        idPrefijoDireccionUno: objGuardar.Prefijo, parteUno: objGuardar.CalleCarrera, parteDos: objGuardar.Direccion,
        parteTres: objGuardar.Interior, predeterminado: 1, codigoPostal: objGuardar.CodigoPostal, operacion: cOperaciones.Ingresar,
        barrio: objGuardar.Strbarrio, ciudad: objGuardar.ciudad, departamento: objGuardar.departamento,
        pais: objGuardar.pais, direccion: objGuardar.direccion });
    }

    return this.CRUDPersonaExistente('UPD', this.DatosPersona).then((ret: any) => {

        // Direcciones
        this.CargarDirecciones();

        return ret;

    });

  }

  EliminarDireccion(idDireccion: number ){

    // cambiar datos del objecto
    if (idDireccion > 0){

      const index = this.DatosPersona.dllDireccion.findIndex( x => x.idDireccion === idDireccion);

      if (index >= 0){

        this.DatosPersona.dllDireccion[0].operacion = cOperaciones.Borrar;

      }
    }

    return this.CRUDPersonaExistente('UPD', this.DatosPersona).then((ret: any) => {

        // Direcciones
        this.CargarDirecciones();

        return ret;

    });

  }

  ActualizarCorreo(correo: string){

    if (this.DatosPersona.dllMail.length > 0){

      this.DatosPersona.dllMail[0].mail = correo;
      this.DatosPersona.dllMail[0].operacion = cOperaciones.Actualizar;

    }else{

      this.DatosPersona.dllMail.push({idMail: 0 , idTipoEmail: 1,  mail: correo, predeterminado: 1, operacion: cOperaciones.Ingresar  });

    }
  }

  ActualizarTelefono(tel: string){

    if (this.DatosPersona.dllTelefono.length > 0){

      this.DatosPersona.dllTelefono[0].telefono = tel;
      this.DatosPersona.dllTelefono[0].operacion = cOperaciones.Actualizar;

    }else{

      this.DatosPersona.dllTelefono.push(
          {idTelefono: 0 , idTipoTelefono: 1, indicativoPais: '', indicativoArea: '' ,
            telefono: tel, extension: '', predeterminado: 1, operacion: cOperaciones.Ingresar   });

    }
  }

  cargarUsuarioStorage() {
    // if (isPlatformBrowser(this.platformId)) {
    //   // Only execute this code on the browser
    //   const usrlogueado = this.localService.getJsonValue(this.token) ?? this.localService.getJsonValueSession(this.token);

    //   if (usrlogueado) {
    //     const RestaurarSesion: LoguinRequest = usrlogueado.loguin;
    //     this.Idempresa = usrlogueado.IdEmp;
    //     this.Loguin(RestaurarSesion);
    //   } else {
    //     this.setEstadoLoguin$(false);
    //     localStorage.setItem("isLogue", "false");
    //   }
    // } else {
    //   // Handle server-side logic if necessary
    // }
  }

  loguout(){

    // colocar datos en cero
    this.razonsocial = '';
    this.correo = '';
    this.Idempresa = 0;
    this.IdPersona = 0;
    this.cedula = 0;

    // quitar logueo
    this.setEstadoLoguin$(false);

    this.recordar = false;

    // borrar registro storage
    const usr = new LoguinRequest();

    this.guardarStorage(usr, this.Idempresa, this.IdPersona, this.cedula);

  }

  private cargarRespuesta(config: any, usrrq: LoguinRequest){

    // validar mensaje
    if (config.estado[0].msgId === EstadoRespuestaMensaje.Error) {

      this.setEstadoLoguin$(false);
      this.MensajeError = config.estado[0].msgStr;

    }else{

      // guardar storage
      this.guardarStorage(usrrq, config.usuario[0].idEmp, config.usuario[0].idnt, config.usuario[0].idPersona );

      this.setUsrLoguin (config);

      this.razonsocial = config.usuario[0].rzScl;
      this.correo = config.usuario[0].mail.toLowerCase();
      this.Idempresa = config.usuario[0].idEmp;
      this.IdPersona = config.usuario[0].idPersona;
      this.cedula= config.usuario[0].idnt

      this.UsrLogin = config;

      this.CRUDPersonaExistente('GET', this.DatosPersona).then((ret: any) => {

        // Direcciones
        this.CargarDirecciones();

      });

    }

  }

  private guardarStorage(usrrq: LoguinRequest, idempresa: number, idPersona: number, cedula: any){

    this.usuarioStorage.loguin = usrrq;
    this.usuarioStorage.IdEmp = idempresa;
    this.usuarioStorage.IdPersona = idPersona;
    this.usuarioStorage.cedula = cedula;


    if (this.recordar) {
      this.localService.setJsonValue(this.token, this.usuarioStorage);
    }else{
      this.localService.clearToken();
    }
  }

  private CargarDirecciones(){

    if (Array.isArray(this.UsrLogin.usuario) && this.UsrLogin.usuario.length
      && this.DatosPersona.dllDireccion.length ){

      this.addresses = [];

      this.DatosPersona.dllDireccion.forEach((direccion, index) => {

        let predeterminado =  true;

        if (index > 0) {
          predeterminado = false;
        }

        this.addresses.push({
          default: predeterminado,
          Id: direccion.idDireccion,
          nombres: this.UsrLogin.usuario[0].nmb.toLowerCase(),
          apellidos: this.UsrLogin.usuario[0].apll.toLowerCase(),
          correo: this.UsrLogin.usuario[0].mail.toLowerCase(),
          telefono: this.UsrLogin.usuario[0].tel,
          pais: direccion.pais.toLowerCase(),
          ciudad: direccion.ciudad.toLowerCase(),
          estado: direccion.departamento.toLowerCase(),
          direccion: direccion.direccion
        });
      });

      this.setdireccionesCargadas$(true);

    }

    // llenar con lo basico si no iene ningn direccion
    if (this.addresses.length === 0){
      this.addresses.push({
        default: true,
        Id: 0,
        nombres: this.UsrLogin.usuario[0].nmb.toLowerCase(),
        apellidos: this.UsrLogin.usuario[0].apll.toLowerCase(),
        correo: this.UsrLogin.usuario[0].mail.toLowerCase(),
        telefono: this.UsrLogin.usuario[0].tel,
        pais: '',
        ciudad: '',
        estado: '',
        direccion: ''
      });
    }

  }


}
