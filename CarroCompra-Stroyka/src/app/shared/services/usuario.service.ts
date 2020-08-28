import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { EstadoRespuestaMensaje } from '../../../data/contantes/cMensajes';

// modelos
import {LoguinRequest} from '../../../data/modelos/seguridad/LoguinRequest';
import {LoginClienteResponse} from '../../../data/modelos/seguridad/LoginClienteResponse';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  UrlServicioLoguin: string;
  UsrLogin: LoginClienteResponse;
  httpOptions: any;
  EsUsuarioLogueado = false;
  MensajeError = '';
  private token = 'token';

  constructor(
        private httpClient: HttpClient,
        private negocio: NegocioService,
        ) {

        // Http Headers
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })};

  }

  Loguin(usrrq: LoguinRequest) {

    this.UrlServicioLoguin = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiNegocio +
    CServicios.ServivioLoguinCLiente;

    return this.httpClient.post(this.UrlServicioLoguin, usrrq , this.httpOptions)
        .toPromise()
        .then((config: any) => {

          this.cargarRespuesta(config);

        })
        .catch((err: any) => {
            console.error(err);
        });
  }

  loguout(){

    // quitar logueo
    this.EsUsuarioLogueado = false;

    // borrar registro storage
    this.guardarStorage(true);

  }

  private cargarRespuesta(config: any){

    this.UsrLogin = config;

    // validar mensaje
    if (this.UsrLogin.estado[0].msgId === EstadoRespuestaMensaje.Error) {

      this.EsUsuarioLogueado = false;
      this.MensajeError = this.UsrLogin.estado[0].msgStr;

    }else{

      // cambiar estado de logueado
      this.EsUsuarioLogueado = true;

      // guardar storage
      this.guardarStorage(true);

    }

  }

  private guardarStorage(guardar: boolean){

    if (guardar) {
      localStorage.setItem(this.token, JSON.stringify(this.UsrLogin));
    }else{
      localStorage.removeItem(this.token);
    }
  }

}
