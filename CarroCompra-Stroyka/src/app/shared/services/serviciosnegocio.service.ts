import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';

@Injectable({
  providedIn: 'root'
})
export class ServiciosnegocioService {
  private UrlServicioFecha: string;
  public latitude: number | null = null;
  public longitude: number | null = null;

  constructor(
    private httpClient: HttpClient,
    private negocio: NegocioService,
    @Inject(PLATFORM_ID) private platformId: Object // Inyección de PLATFORM_ID
  ) { }

  public async recuperarFechayHora(): Promise<string> {
    this.UrlServicioFecha =
      this.negocio.configuracion.UrlServicioCarroCompras +
      CServicios.ApiNegocio +
      CServicios.ServicioFechaServidor;

    try {
      const response = await this.httpClient.get(this.UrlServicioFecha, { responseType: 'text' }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al recuperar fecha y hora:', error);
      throw error; // Rechaza la promesa para manejarlo en el componente
    }
  }

  private getPosition(): Promise<{ lng: number; lat: number }> {
    return new Promise((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) { // Verificamos si estamos en el navegador
        navigator.geolocation.getCurrentPosition(
          resp => {
            resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
          },
          err => {
            switch (err.code) {
              case err.TIMEOUT:
                console.warn('Se ha superado el tiempo de espera');
                break;
              case err.PERMISSION_DENIED:
                console.warn('El usuario no permitió informar su posición');
                break;
              case err.POSITION_UNAVAILABLE:
                console.warn('El dispositivo no pudo recuperar la posición actual');
                break;
            }
            resolve({ lng: 0, lat: 0 }); // Resolvemos con valores por defecto
          }
        );
      } else {
        // Si no estamos en el navegador, resolvemos con valores por defecto
        resolve({ lng: 0, lat: 0 });
      }
    });
  }

  public async getLocation(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {

      try {
        const pos = await this.getPosition();
        this.latitude = pos.lat;
        this.longitude = pos.lng;
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        this.latitude = null;
        this.longitude = null; // Restablecer a null en caso de error
      }
    }
  }
}
