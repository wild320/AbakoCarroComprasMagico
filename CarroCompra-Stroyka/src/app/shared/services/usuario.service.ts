import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { ServiceHelper } from '../services/ServiceHelper';
import { LocalService } from '../services/local-service.service';

// interfaces
import { Address } from '../interfaces/address';
import { addresses } from '../../../data/account-addresses';


// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { EstadoRespuestaMensaje } from '../../../data/contantes/cMensajes';

// modelos
import {LoguinRequest} from '../../../data/modelos/seguridad/LoguinRequest';
import {LoginClienteResponse} from '../../../data/modelos/seguridad/LoginClienteResponse';
import {CRUDPersonaExistenteRequest} from '../../../data/modelos/seguridad/CRUDPersonaExistenteRequest';
import { Persona } from '../../../data/modelos/seguridad/CRUDPersonaExistente';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  UrlServicioLoguin: string;
  private UsrLogin$ = new Subject<LoginClienteResponse>();
  httpOptions: any;
  private UsuarioLogueado: BehaviorSubject<boolean>;
  public addresses: Address[];
  public DatosPersona = new Persona();
  public DatosPersonaRequest = new CRUDPersonaExistenteRequest();
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
        private localService: LocalService
        ) {

        this.addresses = addresses;

        this.UsuarioLogueado = new BehaviorSubject<boolean>(false);

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
          console.error(err);
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
        })
        .catch((err: any) => {
            console.error(err);
        });

  }

  GuardarActualizarUsuario(Nombres: string, Apellidos: string, Correo: string, telefono: string ){

    // cambiar datos del objecto
    this.DatosPersona.nombres = Nombres;
    this.DatosPersona.apellidos = Apellidos;

    // datos de loguin

    return this.CRUDPersonaExistente('SET', this.DatosPersona).then((ret: any) => {

      // recuperar de nuevo loguin
      this.cargarUsuarioStorage();

      // Direcciones
      this.CargarDirecciones();

      return ret;


    });

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

        // cambiar estado de logueado
        this.setEstadoLogueo(true);

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

    if (Array.isArray(this.UsrLogin.usuario) && this.UsrLogin.usuario.length  ){

      this.addresses = [
        {
            default: true,
            nombres: this.UsrLogin.usuario[0].nmb.toLowerCase(),
            apellidos: this.UsrLogin.usuario[0].apll.toLowerCase(),
            correo: this.UsrLogin.usuario[0].mail,
            telefono: this.UsrLogin.usuario[0].tel,
            pais: this.UsrLogin.usuario[0].pai.toLowerCase(),
            ciudad: this.UsrLogin.usuario[0].ciu.toLowerCase(),
            estado: this.UsrLogin.usuario[0].ciu.toLowerCase(),
            direccion: this.UsrLogin.usuario[0].dir
        },
        {
            default: false,
            nombres: 'Jupiter',
            apellidos: 'Saturnov',
            correo: 'stroyka@example.com',
            telefono: 'ZX 971 972-57-26',
            pais: 'RandomLand',
            ciudad: 'MarsGrad',
            estado: 'Estado',
            direccion: 'Sun Orbit, 43.3241-85.239'
        }
      ];
    }
  }

}
