import { Injectable } from '@angular/core';


// Modelos
import { Sesiones } from '../../../data/modelos/negocio/sesiones';


@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  public sesiones: Sesiones[];

  constructor() {

   }

   public iniciarSesiones() {

      this.sesiones = [
        {
          Id: 1,
          Sesion: 'Nosotros',
          Activo: false
        },
        {
          Id: 2,
          Sesion: 'Envio',
          Activo: false
        },
        {
          Id: 3,
          Sesion: 'Terminos',
          Activo: false
        },
        {
          Id: 4,
          Sesion: 'Politicas',
          Activo: false
        },
        {
          Id: 5,
          Sesion: 'Blog',
          Activo: false
        },
        {
          Id: 6,
          Sesion: 'FAQ',
          Activo: false
        },
        {
          Id: 7,
          Sesion: 'Contactenos',
          Activo: false
        },
      ];

   }
}
