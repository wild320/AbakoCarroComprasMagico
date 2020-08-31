import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { ServiceHelper } from '../services/ServiceHelper';
import { LocalService } from '../services/local-service.service';


// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { EstadoRespuestaMensaje } from '../../../data/contantes/cMensajes';

// modelos
import {LoguinRequest} from '../../../data/modelos/seguridad/LoguinRequest';
import {LoginClienteResponse} from '../../../data/modelos/seguridad/LoginClienteResponse';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  UrlServicioLoguin: string;
  private UsrLogin$ = new Subject<LoginClienteResponse>();
  httpOptions: any;
  private UsuarioLogueado: BehaviorSubject<boolean>;
  MensajeError = '';
  recordar = false;
  private token = 'token';


  constructor(
        private servicehelper: ServiceHelper<any, any>,
        private negocio: NegocioService,
        private localService: LocalService
        ) {

         this.UsuarioLogueado = new BehaviorSubject<boolean>(false);

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

      // cambiar estado de logueado
      this.setEstadoLogueo(true);

      // guardar storage
      this.guardarStorage(usrrq);

      this.setUsrLoguin (config);

    }

  }

  private guardarStorage(usrrq: LoguinRequest){

    if (this.recordar) {
      this.localService.setJsonValue(this.token, usrrq);
    }else{
      this.localService.clearToken();
    }
  }

}
