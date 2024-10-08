import { Inject, Injectable, PLATFORM_ID,  } from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { ServiceHelper } from '../services/ServiceHelper';
import { UsuarioService } from '../services/usuario.service';

// Modelos
import {Notifications} from '../../../data/modelos/negocio/notifications';
import {Mensaje} from '../../../data/modelos/negocio/Mensaje';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { EstadoRespuestaMensaje } from '../../../data/contantes/cMensajes';
import { CNotificaciones } from 'src/data/contantes/cNotificaciones';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private UrlServicio: string;
  private UrlServicioMensajeLeido: string;

  public hubConnection: HubConnection;
  private Notificaciones: Notifications[];
  private Notificaciones$ = new Subject<Notifications>();
  private MsgRespuesta = new Mensaje();
  private idpersona: number;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,private negocio: NegocioService,
              private servicehelper: ServiceHelper<any, any>,
              public usuariosvc: UsuarioService,
              ) { 

    this.Notificaciones = [];
    if (isPlatformBrowser(this.platformId)) {
      
          // suscribirse al grupo de cliente 
          this.usuariosvc.getEstadoLoguin$().subscribe(value => {
            if (value){
              this.idpersona = this.usuariosvc.IdPersona;
            }
          })
      
          // cargar la url donde esta el hub
          this.UrlServicio = this.negocio.configuracion.UrlServicioNegocio + CNotificaciones.UrlHubNotificaciones;
      
          this.IniciarConnection();
      
          this.IniciarEscuchador();

    }
   
  }

  // iniciar conecion 
  private IniciarConnection (){

    let builder  = new HubConnectionBuilder()

    this.hubConnection = builder.configureLogging(LogLevel.None)
                                .withUrl(this.UrlServicio)
                                .build()
    
    this.hubConnection
      .start()
      .then( () => {

        // suscribirse al grupo de cliente 
        this.hubConnection.invoke('AgregaraGrupo', CNotificaciones.GrupoCliente).catch(err => 
          console.log('Error agregadon a grupo: ' + err)
        )

      })
      .then( () => {

        if (this.idpersona){

          // suscribirse al grupo de usuario 
          this.hubConnection.invoke('AgregaraGrupo', this.idpersona.toString()).catch(err => 
            console.log('Error agregadon a grupo: ' + err)
          )
        }
      }


      )
      .catch(err => 
        console.log('Error conectado al hub: ' + err)
      );

  }

  // es escuchador para mensaje de todos
  private IniciarEscuchador(){

    // recibir notificacion 
    this.hubConnection.on("RecibirMensaje", data => {

      this.ArmarNotificacion(data);
      
    });

  }

  // organzir el mensaje para usarlo donde se desea
  private ArmarNotificacion(mensaje: any){

    const Notif = new Notifications();

    Notif.id = mensaje.id,
    Notif.estilo = 'GREEN',
    Notif.titulo = mensaje.titulo;
    Notif.mensaje = mensaje.mensaje,

    this.setNotificacion$(Notif);

  }  

  public getNotificacion$(): Observable<Notifications> {
    return this.Notificaciones$.asObservable();
  }

  public getNotificacion(): Notifications[] {
    return this.Notificaciones;
  }

  private setNotificacion$(newValue){
    this.Notificaciones.push (newValue);
    this.Notificaciones$.next(newValue);
  }

  // marcar notificacion como leida
  public SetNotificacionMensajeLeida(idnotificacion: number) {
    this.UrlServicioMensajeLeido =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiNegocio +
        CServicios.ServicioSerNotificacionMensajeLeida;

    return this.servicehelper
        .PostData(this.UrlServicioMensajeLeido, idnotificacion)
        .toPromise()
        .then((config: any) => {

            this.MsgRespuesta.msgId = config.estado;
            this.MsgRespuesta.msgStr = config.mensaje;

            return this.MsgRespuesta;
   
        })
        .catch((err: any) => {

            this.MsgRespuesta.msgId = EstadoRespuestaMensaje.Error;
            this.MsgRespuesta.msgStr = 'Error al consumir servicio:' + err.message;

            return this.MsgRespuesta;
        });

  }

}
