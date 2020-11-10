import { Injectable, ɵConsole } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private UrlServicioLoguin: string;
  private UrlServicioLocalizacion: string;
  private UsrLogin$ = new Subject<LoginClienteResponse>();
  private UsuarioLogueado: BehaviorSubject<boolean>;
  private VerificarExistencia = new VerificarExistenciaClienteRequest();
  private MsgRespuesta = new Mensaje();
  public addresses: Address[];
  public departamentos: string[];
  public ciudad: MaestroCiudad[];
  public DatosPersona = new Persona();
  public DatosPersonaRequest = new CRUDPersonaExistenteRequest();
  public objMaestrosLocalizacion = new MaestrosLocalizacionResponse();
  public MaestrosLocalizacionRequest = new MaestrosLocalizacionRequest();
  public RecuperarUsuario = new RecuperarUsuarioResponse();
  public logueo: boolean;
  public Idempresa: number;
  public IdPersona: number;
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
        private localService: LocalService
        ) {

        this.UsuarioLogueado = new BehaviorSubject<boolean>(false);
        this.addresses = [];

        this.UsuarioLogueado.subscribe(value => {
          this.logueo = value;
        });

  }

  setEstadoLogueo(newValue): void {
    this.UsuarioLogueado.next(newValue);
  }

  getEstadoLogueo(): Observable<boolean> {

    return this.UsuarioLogueado.asObservable();
  }

  setUsrLoguin(usuario: LoginClienteResponse) {
    this.UsrLogin$.next(usuario);
  }

  getUsrLoguin(): Observable<LoginClienteResponse> {
    return this.UsrLogin$.asObservable();
  }

  private CRUDPersonaExistente(accion: string, persona: Persona ): Promise<void> {
    this.UrlServicioLoguin =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiNegocio +
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

    this.recordar = usrrq.recordar;

    return this.servicehelper
        .PostData(this.UrlServicioLoguin, usrrq)
        .toPromise()
        .then((config: any) => {

            this.cargarRespuesta(config, usrrq);

            this.MsgRespuesta.msgId = EstadoRespuestaMensaje.exitoso;
            this.MsgRespuesta.msgStr = 'Usuario exitoso';

            // cambiar estado de logueado
            this.setEstadoLogueo(true);

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
    this.negocio.configuracion.UrlServicioCarroCompras +
    CServicios.ApiNegocio +
    CServicios.ServivioCrearCliente;

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


    return this.CRUDPersonaExistente('SET', this.DatosPersona).then((ret: any) => {

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

  CargarMaestrosLocalizacion(){

    if (this.objMaestrosLocalizacion.barrios === undefined){
      return this.MaestrosLocalizacion().then((ret: any) => { });
    }

  }

  GuardarActualizarContrasena(Contrasena: string ){

    // cambiar datos del objecto
    this.DatosPersona.dllUsuario[0].contrasena = Contrasena;

    return this.CRUDPersonaExistente('SET', this.DatosPersona).then((ret: any) => {

      if (this.logueo){

        // actualizamos datos del storage
        let UsuarioSesion = new LoguinRequest();
        UsuarioSesion = this.localService.getJsonValue(this.token);
        UsuarioSesion.contrasena = Contrasena;

        this.guardarStorage(UsuarioSesion);

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

    return this.CRUDPersonaExistente('SET', this.DatosPersona).then((ret: any) => {

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

    return this.CRUDPersonaExistente('SET', this.DatosPersona).then((ret: any) => {

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

  cargarUsuarioStorage(){

    // validar que tenga usuario en el stora y lo logueamos
    const usrlogueado = this.localService.getJsonValue(this.token);

    if (usrlogueado)   {

      const RestaurarSesion: LoguinRequest = usrlogueado;

      this.Loguin(RestaurarSesion);

    }

  }

  loguout(){

    // quitar logueo
    this.setEstadoLogueo(false);

    this.recordar = false;

    // borrar registro storage
    const usr = new LoguinRequest();

    this.guardarStorage(usr);

  }

  private cargarRespuesta(config: any, usrrq: LoguinRequest){

    // validar mensaje
    if (config.estado[0].msgId === EstadoRespuestaMensaje.Error) {

      this.setEstadoLogueo(false);
      this.MensajeError = config.estado[0].msgStr;

    }else{

      // guardar storage
      this.guardarStorage(usrrq);

      this.setUsrLoguin (config);

      this.razonsocial = config.usuario[0].rzScl;
      this.correo = config.usuario[0].mail.toLowerCase();
      this.Idempresa = config.usuario[0].idEmp;
      this.IdPersona = config.usuario[0].idPersona;

      this.UsrLogin = config;

      this.CRUDPersonaExistente('GET', this.DatosPersona).then((ret: any) => {

        // Direcciones
        this.CargarDirecciones();

      });

    }

  }

  private guardarStorage(usrrq: LoguinRequest){

    if (this.recordar) {
      this.localService.setJsonValue(this.token, usrrq);
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
