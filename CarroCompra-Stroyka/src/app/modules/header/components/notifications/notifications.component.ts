import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';


// Modelos
import {Notifications} from '../../../../../data/modelos/negocio/notifications';
import {Mensaje} from '../../../../../data/modelos/negocio/Mensaje';
import { NotificacionesService } from 'src/app/shared/services/notificaciones.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notification: Notifications;
  public notifications: Notifications[];
  public selectedNotification = new Notifications();
  private selectedIndex = 0;
  private MsgRespuesta = new Mensaje();

  constructor(private notificacionessvc: NotificacionesService) {

  }

  ngOnInit() {

    // tslint:disable-next-line: deprecation
    this.notificacionessvc.getNotificacion$().subscribe( data => {

      this.notifications  = [];
      this.notifications = this.notificacionessvc.getNotificacion();
      if (this.notifications.length > 0) {
        this.selectedNotification = this.notifications[0];
      }

    });
  }

  CerrarNotificacion(selectedNotification: Notifications){

    if (selectedNotification.id > 0) {
      this.notificacionessvc.SetNotificacionMensajeLeida(selectedNotification.id).then();
    }
  }

  CambiarNotificacionUp(selectedNotification: Notifications){

    const index = this.notifications.findIndex( x => x.id === selectedNotification.id);
    const longmensajes = this.notifications.length;

    if ( index < longmensajes - 1 ){
      this.selectedNotification = this.notifications[index + 1];
    }

    if ( index === longmensajes - 1 ){
      this.selectedNotification = this.notifications[0];
    }

  }

  CambiarNotificacionDown(selectedNotification: Notifications){

    const index = this.notifications.findIndex( x => x.id === selectedNotification.id);
    const longmensajes = this.notifications.length;

    if ( index <= longmensajes && index > 0 ){
      this.selectedNotification = this.notifications[index - 1];
    }

    if ( index === 0 ){
      this.selectedNotification = this.notifications[longmensajes - 1];
    }

  }


}
