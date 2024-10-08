import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { WINDOW, windowProvider } from './providers/window';
import { routes } from './routes';
import { BannerService } from './shared/services/banner.service';
import { NegocioService } from './shared/services/negocio.service';
import { StoreService } from './shared/services/store.service';
import { UsuarioService } from './shared/services/usuario.service';
import { UtilsTexto } from './shared/utils/UtilsTexto';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function CargarConfiguracion(configLocal: NegocioService, configGeneral: StoreService, usuario: UsuarioService, banner: BannerService) {
  return async (): Promise<any> => {
    try {
      // Carga la configuración local
      await configLocal.loadSettingsFromServer();
      // Utiliza la configuración local para cargar la configuración general
      await configGeneral.cargarConfiguracionGeneral(); // Pasa la configuración local como argumento

      // Carga el resto de las configuraciones
      await usuario.cargarUsuarioStorage();
    //  await banner.cargarBanner();
    } catch (error) {
      console.error('Error al cargar la configuración:', error);
    }
  };
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideToastr(),    
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserAnimationsModule),
    UtilsTexto,
    BrowserAnimationsModule,
    {
      provide: APP_INITIALIZER,
      useFactory: CargarConfiguracion,
      multi: true,
      deps: [NegocioService, StoreService, UsuarioService, BannerService],
    },
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },
  ]
};

export function getBaseUrl(platformId: Object) {
  if (isPlatformBrowser(platformId)) {
    return document.getElementsByTagName('base')[0]?.href || '/';
  } else {
    return '/'; // Provide a default value or handle it as needed for server-side
  }
}