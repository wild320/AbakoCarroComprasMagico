import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NavigationLink} from '../interfaces/navigation-link';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { PaginasService } from './paginas.service';

// Contantes
import { Crutas, ClabelRutas } from 'src/data/contantes/cRutas';
import { CServicios } from '../../../data/contantes/cServicios';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    UrlServicioCarroCompras: string;
    address = '';
    email = '';
    phone = '';
    hours = '';
    scrmapa = '';
    verArticulos = '';
    verDetalleArticulo = '';
    public navigation: NavigationLink[];

    constructor(private httpClient: HttpClient,
                private negocio: NegocioService,
                private paginaService: PaginasService) {

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
                this.hours =  element.valor;
            }

            // Como ver la lista de articulos
            if (element.id === 'A2'){
                this.verArticulos =   this.VerArticulos(element.valor);
            }

            // Como ver la detalle de articulo
            if (element.id === 'A3'){
                this.verDetalleArticulo =   this.VerDetalleArticulos(element.valor);
            }

            // src mapa google
            if (element.id === 'A4'){
                this.scrmapa =   element.valor;
            }

            // Direccion
            if (element.id === 'B1'){
                this.address =  element.valor;
            }

            // telefono
            if (element.id === 'B2'){
                this.phone =  element.valor;
            }

            // correo
            if (element.id === 'B3'){
                this.email =  element.valor;
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
            {label: 'Comprar', url: '/shop/catalog/power-tools', menu: {
                type: 'menu',
                items: [
                    {label: 'Artículos', url: this.verArticulos},
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
                tipoVer = '/shop/catalog/power-tools';
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
                tipoVer = '/shop/catalog/power-tools';
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
