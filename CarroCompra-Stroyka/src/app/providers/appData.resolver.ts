import type { ResolveFn } from '@angular/router';
import { NegocioService } from '../shared/services/negocio.service';
import { StoreService } from '../shared/services/store.service';
import { inject } from '@angular/core';

export const appDataResolver: ResolveFn<boolean> = async (route, state) => {
  const negocioService = inject(NegocioService);
  const storeService = inject(StoreService);
  try {
    // Cargar configuración desde el servidor
    await negocioService.loadSettingsFromServer();
    await storeService.cargarConfiguracionGeneral();
    
    // Retorna true si todo se carga correctamente
    return true;
  } catch (error) {
    console.error('Error al resolver los datos de la aplicación:', error);
    // Manejo del error (retornar false o algún valor que indique error)
    return false; // Puedes retornar un valor que indique un fallo en la carga
  }
};
