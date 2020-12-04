import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NavigationLink} from '../interfaces/navigation-link';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { PaginasService } from './paginas.service';

// Contantes
import { Crutas, ClabelRutas } from 'src/data/contantes/cRutas';
import { CServicios } from '../../../data/contantes/cServicios';

// modelos
import {ConfiguracionSitio} from '../../../data/modelos/negocio/ConfiguracionSitio';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    UrlServicioCarroCompras: string;
    public navigation: NavigationLink[];
    public configuracionSitio = new ConfiguracionSitio();

    constructor(private httpClient: HttpClient,
                private negocio: NegocioService,
                private paginaService: PaginasService) {

        this.Iniciarlizarconfigurcion();

    }

    private Iniciarlizarconfigurcion(){

        this.configuracionSitio.address = '',
        this.configuracionSitio.email = '';
        this.configuracionSitio.phone = '';
        this.configuracionSitio.hours = '';
        this.configuracionSitio.scrmapa = '';
        this.configuracionSitio.verArticulos = '';
        this.configuracionSitio.verDetalleArticulo = '';
        this.configuracionSitio.VerProductosDestacados = false;
        this.configuracionSitio.VerMasVendidos = false;
        this.configuracionSitio.VerCategoriasPopulares = false;
        this.configuracionSitio.VerRecienllegados = false;
        this.configuracionSitio.VerUltimasNoticias = false;
        this.configuracionSitio.VerMarcas = false;
        this.configuracionSitio.VerBLoqueValoradosEspecialesVendidos = false;
        this.configuracionSitio.VerBannerIntermedio = false;

    }

    cargarConfiguracionGeneral() {

        this.UrlServicioCarroCompras = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiCarroCompras +
        CServicios.ServicioConfiguracionCC;

        return this.httpClient.get(this.UrlServicioCarroCompras + '/1')
            .toPromise()
            .then((config: any) => {
                this.SetiarInformacion (config);

            })
            .catch((err: any) => {
                console.error(err);
            });
    }

    private SetiarInformacion(configuracion: any){

        // las sesiones siempre inician apagagas, la configuracion trae cuales quedan activas
        this.paginaService.iniciarPaginas();

        configuracion.forEach(element => {

            // Hora de servicio
            if (element.id === 'A1'){
                this.configuracionSitio.hours =  element.valor;
            }

            // Como ver la lista de articulos
            if (element.id === 'A2'){
                this.configuracionSitio.verArticulos =   this.VerArticulos(element.valor);
            }

            // Como ver la detalle de articulo
            if (element.id === 'A3'){
                this.configuracionSitio.verDetalleArticulo =   this.VerDetalleArticulos(element.valor);
            }

            // src mapa google
            if (element.id === 'A4'){
                this.configuracionSitio.scrmapa =   element.valor;
            }

            if (element.id === 'A6'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerProductosDestacados = true;
                }

            }

            if (element.id === 'A7'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerMasVendidos = true;
                }
            }

            if (element.id === 'A8'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerCategoriasPopulares = true;
                }
            }

            if (element.id === 'A9'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerRecienllegados = true;
                }
            }

            if (element.id === 'A10'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerUltimasNoticias = true;
                }
            }

            if (element.id === 'A11'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerMarcas = true;
                }
            }

            if (element.id === 'A12'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerBLoqueValoradosEspecialesVendidos = true;
                }
            }

            if (element.id === 'A13'){
                if (element.valor === 'SI'){
                    this.configuracionSitio.VerBannerIntermedio = true;
                }
            }

            // Direccion
            if (element.id === 'B1'){
                this.configuracionSitio.address =  element.valor;
            }

            // telefono
            if (element.id === 'B2'){
                this.configuracionSitio.phone =  element.valor;
            }

            // correo
            if (element.id === 'B3'){
                this.configuracionSitio.email =  element.valor;
            }

            // activar o desactivar paginas
            if (element.id[0]   === 'S'){
                this.ActicarPaginas(element.valor);
            }

        });

        this.CargarMenu(false);
    }

    public CargarMenu(CargarUsuario: boolean) {

        this.navigation = [];

        this.navigation = [
            {label: 'Inicio', url: '/'},
            {label: 'Comprar', url: '/shop/catalog', menu: {
                type: 'menu',
                items: [
                    {label: 'Artículos', url: this.configuracionSitio.verArticulos},
                    {label: 'Lista de Deseos', url: '/shop/wishlist'},
                    {label: 'Comparar', url: '/shop/compare'},
                ]
            }},
            {label: 'Sitios', url: '/site', menu: {
                type: 'menu',
                items: [ ]
            }},

        ];

        if (CargarUsuario) {

            this.navigation.push(
            {label: 'Cuenta', url: '/account', menu: {
                type: 'menu',
                items: [
                    {label: ClabelRutas.Dashboard, url: Crutas.Dashboard},
                    {label: ClabelRutas.EditarCuenta,    url: Crutas.EditarCuenta},
                    {label: ClabelRutas.MiHistorial,   url: Crutas.MiHistorial},
                    {label: ClabelRutas.MisDirecciones,    url: Crutas.MisDirecciones},
                    {label: ClabelRutas.Cotrasena, url: Crutas.Cotrasena},
                    {label: ClabelRutas.CerrarSesion, url: Crutas.CerrarSesion}
                ]
            }});

        }

        this.IngresarMenuDinamico();
    }

    private IngresarMenuDinamico() {

        // asignar los menus de pagisnas dinamicamente
        const index = this.navigation.findIndex(x => x.label === 'Sitios');
        const item = 'items';

        this.paginaService.paginas.forEach((element,  array) => {

            if (element.Activo){
                this.navigation[index].menu[item].push({label: element.label,  url:  element.url});
            }
        });

    }

    private VerArticulos(ver: string): string {

        let tipoVer = '';

        switch (ver) {
            case 'En Cuadricula 3 Columnas con Slider':
                tipoVer = '/shop/catalog';
                break;

            case 'En Cuadricula 4 Columnas Full':
                tipoVer = '/shop/category-grid-4-columns-full';
                break;

            case 'En Cuadricula 5 Columnas Full':
                tipoVer = '/shop/category-grid-5-columns-full';
                break;

             case 'En Lista':
                tipoVer = '/shop/category-list';
                break;

            case 'En Cuadricula Slider A la Derecha':
                tipoVer = '/shop/category-right-sidebar';
                break;

            default:
                tipoVer = '/shop/catalog';
                break;

        }

        return tipoVer;
    }

    private VerDetalleArticulos(ver: string): string {

        let tipoDetalleVer = '';

        switch (ver) {
            case 'Estandar':
                tipoDetalleVer = '/shop/product-standard';
                break;

            case 'Columna':
                tipoDetalleVer = '/shop/product-columnar';
                break;

            case 'SliBar':
                tipoDetalleVer = '/shop/product-sidebar';
                break;

            default:
                tipoDetalleVer = '/shop/product-standard';
                break;

        }

        return tipoDetalleVer;
    }

    private ActicarPaginas(ses: string){

        const index = this.paginaService.paginas.findIndex(x => x.Id === parseInt(ses, 10));

        // activar la sesion que se encuentre
        this.paginaService.paginas[index].Activo = true;

    }
}
