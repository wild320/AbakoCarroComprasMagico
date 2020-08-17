import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NavigationLink} from '../interfaces/navigation-link';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Contantes
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
    verArticulos = '';
    public navigation: NavigationLink[];

    constructor(private httpClient: HttpClient,
                private negocio: NegocioService) {  }


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

        configuracion.forEach(element => {

            // Hora de servicio
            if (element.id === 'A1'){
                this.hours =  element.valor;
            }

            // Como ver la lista de articulos
            if (element.id === 'A2'){
                this.verArticulos =   this.VerArticulos(element.valor);
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

        });

        this.CargarMenu();
    }

    private CargarMenu() {

        this.navigation = [
            {label: 'Inicio', url: '/'},
            {label: 'Comprar', url: '/shop/catalog/power-tools', menu: {
                type: 'menu',
                items: [
                    {label: 'Artículos', url: this.verArticulos},
                    {label: 'Product', url: '/shop/product-standard', items: [
                        {label: 'Product', url: '/shop/product-standard'},
                        {label: 'Product Alt', url: '/shop/product-columnar'},
                        {label: 'Product Sidebar', url: '/shop/product-sidebar'}
                    ]},
                    {label: 'Lista de Deseos', url: '/shop/wishlist'},
                    {label: 'Comparar', url: '/shop/compare'},
                ]
            }},
            {label: 'Cuenta', url: '/account', menu: {
                type: 'menu',
                items: [
                    {label: 'Login',           url: '/account/login'},
                    {label: 'Dashboard',       url: '/account/dashboard'},
                    {label: 'Edit Profile',    url: '/account/profile'},
                    {label: 'Order History',   url: '/account/orders'},
                    {label: 'Order Details',   url: '/account/orders/5'},
                    {label: 'Address Book',    url: '/account/addresses'},
                    {label: 'Edit Address',    url: '/account/addresses/5'},
                    {label: 'Change Password', url: '/account/password'}
                ]
            }},
            {label: 'Blog', url: '/blog/category-grid'},
            {label: 'Sitios', url: '/site', menu: {
                type: 'menu',
                items: [
                    {label: 'Acerca de Nosotros',             url: '/site/about-us'},
                    {label: 'Contactanos',           url: '/site/contact-us'},
                    {label: 'Terminos', url: '/site/terms'},
                    {label: 'FAQ',                  url: '/site/faq'},
                ]
            }}
        ];
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
        console.log(tipoVer);

        return tipoVer;
    }
}
