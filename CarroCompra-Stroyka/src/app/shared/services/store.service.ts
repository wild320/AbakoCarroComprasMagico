import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationLink } from '../interfaces/navigation-link';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { PaginasService } from './paginas.service';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';

// modelos
import { ConfiguracionSitio } from '../../../data/modelos/negocio/ConfiguracionSitio';
import { SocialLinksItem } from '../../../data/modelos/negocio/RedesSociales';
import { ClabelRutas, Crutas } from '../../../data/contantes/cRutas';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    UrlServicioCarroCompras: string;
    public navigation: NavigationLink[];
    public configuracionSitio = new ConfiguracionSitio();
    public redes: SocialLinksItem[] = [];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private httpClient: HttpClient,
        private negocio: NegocioService,
        private paginaService: PaginasService) {}

    async cargarConfiguracionGeneral() {
        if (isPlatformBrowser(this.platformId)) {
            try {
                this.UrlServicioCarroCompras = `${this.negocio.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioConfiguracionCC}`;
    
                const config = await this.httpClient.get(`${this.UrlServicioCarroCompras}/1`).toPromise();
                this.SetiarInformacion(config);
    
            } catch (err) {
                console.error('Error fetching configuration:', err);
            }
        }
    
    }

    private SetiarInformacion(configuracion: any) {

        // las sesiones siempre inician apagagas, la configuracion trae cuales quedan activas
        this.paginaService.iniciarPaginas();

        configuracion.forEach(({ id, valor }) => {

            switch (id) {
                // Hora de servicio
                case 'A1':
                    this.configuracionSitio.hours = valor;
                    break;
                // src mapa google
                case 'A4':
                    this.configuracionSitio.scrmapa = valor;
                    break;
                // Configuración de visualización (elementos con valor 'SI')
                case 'A6':
                case 'A7':
                case 'A8':
                case 'A9':
                case 'A10':
                case 'A11':
                case 'A12':
                case 'A13':
                case 'A30':
                case 'A34':
                case 'A35':
                case 'A36':
                case 'A37':
                case 'A38':
                case 'A41':
                case 'A43':
                case 'A44':
                    this.setConfigBooleanOption(id, valor);
                    break;
                // Mostrar precios sin logueo (condición con valor 'NO')
                case 'A31':
                    this.configuracionSitio.MostrarPreciosSinLogueo = valor !== 'NO';
                    break;
                // Posicionamiento en Google
                case 'A32':
                    this.configuracionSitio.PosicionamientoEnGoogle = valor;
                    break;
                // Script de rastreo
                case 'A33':
                    if (valor.length > 3) {
                        this.configuracionSitio.scriptRastreo = valor;
                    }
                    break;
                // Redes sociales
                case 'A20':
                    this.addSocialMedia('facebook', valor, 'fab fa-facebook-f');
                    break;
                case 'A21':
                    this.addSocialMedia('twitter', valor, 'fab fa-twitter');
                    break;
                case 'A22':
                    this.addSocialMedia('youtube', valor, 'fab fa-youtube');
                    break;
                case 'A23':
                    this.addSocialMedia('instagram', valor, 'fab fa-instagram');
                    break;
                // Pasarelas
                case 'A24':
                case 'A25':
                case 'A26':
                case 'A28':
                case 'A29':
                    this.setPasarelaOption(id, valor);
                    break;
                // Mensaje personalizado en el pago
                case 'A49':
                    this.configuracionSitio.MensajePersonalizadoPago = valor;
                    break;
                // Dirección, teléfono, correo, agencia, asesor, número de WhatsApp
                case 'B1':
                    this.configuracionSitio.address = valor;
                    break;
                case 'B2':
                    this.configuracionSitio.phone = valor;
                    break;
                case 'B3':
                    this.configuracionSitio.email = valor;
                    break;
                case 'B4':
                    this.configuracionSitio.AgenciaDefaul = valor;
                    break;
                case 'B5':
                    this.configuracionSitio.AsesorPredeterminado = valor;
                    break;
                case 'A39':
                    this.configuracionSitio.NumeroWpp = valor;
                    break;
                // Activar o desactivar páginas
                default:
                    if (id[0] === 'S') {
                        this.ActicarPaginas(valor);
                    } else if (id === 'A47') {
                        this.configuracionSitio.VerFiltroMarcas = valor !== 'NO';
                    } else if (id === 'A48') {
                        this.configuracionSitio.VerMarcaDetalleProducto = valor !== 'NO';
                    }
                    break;
            }
        });

        this.CargarMenu(false);
    }

    private setConfigBooleanOption(id: string, valor: string): void {
        const optionsMap = {
            'A6': 'VerProductosDestacados',
            'A7': 'VerMasVendidos',
            'A8': 'VerCategoriasPopulares',
            'A9': 'VerRecienllegados',
            'A10': 'VerUltimasNoticias',
            'A11': 'VerMarcas',
            'A12': 'VerBLoqueValoradosEspecialesVendidos',
            'A13': 'VerBannerIntermedio',
            'A30': 'SuperarInventario',
            'A34': 'VerSeguimientoPedidos',
            'A35': 'VerCompararProductos',
            'A36': 'VerSuscribirse',
            'A37': 'CreacionDirectaClientes',
            'A38': 'VerWppIcono',
            'A41': 'VerContacto',
            'A43': 'VerNoticias',
            'A44': 'VerBontonAplicarCupon',
        };
        if (valor === 'SI') {
            this.configuracionSitio[optionsMap[id]] = true;
        }
    }

    private addSocialMedia(type: string, url: string, icon: string): void {
        this.redes.push({ type, url, icon });
    }

    private setPasarelaOption(id: string, valor: string): void {
        const pasarelaMap = {
            'A24': 'PasaleraPSE',
            'A25': 'PasarelaTranferenciaBancaria',
            'A26': 'PasaleraContraEntrega',
            'A28': 'VerBannerInformacion',
            'A29': 'VerAcordeonInformacion',
        };
        this.configuracionSitio[pasarelaMap[id]] = valor !== 'NO';
    }

    public CargarMenu(CargarUsuario: boolean) {

        this.navigation = [];
        if (isPlatformBrowser(this.platformId)) {
            if (!this.configuracionSitio.VerCompararProductos) {
                this.navigation = [
                    { label: 'Inicio', url: '/' },
                    {
                        label: 'Comprar', url: '/shop/catalog', menu: {
                            type: 'menu',
                            items: [
                                { label: 'Artículos', url: '/shop/catalog' },
                                { label: 'Lista de Deseos', url: '/shop/wishlist' },
                            ]
                        }
                    },
                    {
                        label: 'Sitios', url: '/site', menu: {
                            type: 'menu',
                            items: []
                        }
                    },
    
                ];
            } else {
                this.navigation = [
                    { label: 'Inicio', url: '/' },
                    {
                        label: 'Comprar', url: '/shop/catalog', menu: {
                            type: 'menu',
                            items: [
                                { label: 'Artículos', url: '/shop/catalog' },
                                { label: 'Lista de Deseos', url: '/shop/wishlist' },
                                { label: 'Comparar', url: '/shop/compare' },
                            ]
                        }
                    },
                    {
                        label: 'Sitios', url: '/site', menu: {
                            type: 'menu',
                            items: []
                        }
                    },
    
                ];
            }
    
            if (CargarUsuario) {
    
                this.navigation.push(
                    {
                        label: 'Cuenta', url: '/account', menu: {
                            type: 'menu',
                            items: [
                                { label: ClabelRutas.Dashboard, url: Crutas.Dashboard },
                                { label: ClabelRutas.EditarCuenta, url: Crutas.EditarCuenta },
                                { label: ClabelRutas.MiHistorial, url: Crutas.MiHistorial },
                                { label: ClabelRutas.MisDirecciones, url: Crutas.MisDirecciones },
                                { label: ClabelRutas.Cotrasena, url: Crutas.Cotrasena },
                                { label: ClabelRutas.CerrarSesion, url: Crutas.CerrarSesion }
                            ]
                        }
                    });
    
            }
    
            this.IngresarMenuDinamico();
        }



    }

    private IngresarMenuDinamico() {

        // asignar los menus de pagisnas dinamicamente
        const index = this.navigation.findIndex(x => x.label === 'Sitios');
        const item = 'items';

        this.paginaService.paginas.forEach((element, array) => {

            if (element.Activo) {
                this.navigation[index].menu[item].push({ label: element.label, url: element.url });
            }
        });

    }

    private ActicarPaginas(ses: string) {

        const index = this.paginaService.paginas.findIndex(x => x.Id === parseInt(ses, 10));

        // activar la sesion que se encuentre
        this.paginaService.paginas[index].Activo = true;

    }
}
