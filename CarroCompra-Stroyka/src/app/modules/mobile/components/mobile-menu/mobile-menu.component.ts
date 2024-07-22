import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MobileMenuService } from '../../../../shared/services/mobile-menu.service';
import { MobileMenuItem } from '../../../../shared/interfaces/mobile-menu-item';

// servicios
import { UsuarioService } from '../../../../../app/shared/services/usuario.service';
import { PaginasService } from '../../../../../app/shared/services/paginas.service';
import { ArticulosService } from '../../../../shared/services/articulos.service';
import { RootService } from '../../../../shared/services/root.service';

// constantes
import { Crutas, ClabelRutas } from 'src/data/contantes/cRutas';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnDestroy, OnInit {
    private destroy$: Subject<any> = new Subject();

    isOpen = false;
    links: MobileMenuItem[];

    constructor(public mobilemenu: MobileMenuService,
        public root: RootService,
        public usuariosvc: UsuarioService,
        private paginaService: PaginasService,
        public articulossvc: ArticulosService,
        public storeService: StoreService) {

        this.UsuarioLogueado();

    }

    ngOnInit(): void {
        this.mobilemenu.isOpen$.pipe(takeUntil(this.destroy$)).subscribe(isOpen => this.isOpen = isOpen);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onItemClick(event: MobileMenuItem): void {

        if (event.type === 'link') {
            if (event.label === ClabelRutas.CerrarSesion) {
                this.usuariosvc.loguout();
                this.mobilemenu.close();
            } else {
                this.mobilemenu.close();
            }

        }

    }

    private UsuarioLogueado() {

        this.usuariosvc.getEstadoLoguin$().subscribe((value) => {
            this.cargarMenu(value);

        });

    }


    cargarMenu(CargarUsuario: boolean) {

        // Estructura base de los enlaces
        const baseLinks: any[] = [
            { type: 'link', label: 'Inicio', url: '/' },
            { type: 'link', label: 'Categorias', url: '/shop/catalog', children: [] },
            {
                type: 'link', label: 'Comprar', url: '/shop/catalog', children: [
                    { type: 'link', label: 'Artículos', url: '/shop/catalog' },
                    { type: 'link', label: 'Lista de Deseos', url: '/shop/wishlist' }
                ]
            },
            { type: 'link', label: 'Sitios', url: '/site', children: [] }
        ];

        // Añadir enlace "Comparar" si es necesario
        if (this.storeService.configuracionSitio.VerCompararProductos) {
            baseLinks[2].children.push({ type: 'link', label: 'Comparar', url: '/shop/compare' });
        }

        // Asignar los enlaces a la propiedad `links`
        this.links = baseLinks;


        // cargar categorias
        this.CargarCategorias()

        // cargar el loguin si etsa logueado
        this.CargarCuenta(CargarUsuario)


        // cargar los sitios internos
        this.CargarSitios();

        // cargar adicoonales
        this.CargarAdicionales()

    }

    CargarSitios() {

        // asignar los menus de pagisnas dinamicamente
        const index = this.links.findIndex(x => x.label === 'Sitios');

        this.paginaService.paginas.forEach((element, array) => {

            if (element.Activo) {
                this.links[index].children.push({ type: 'link', label: element.label, url: element.url });
            }
        });

    }
    

    CargarCuenta(CargarUsuario: boolean) {

        if (CargarUsuario) {

            //cargar moneda
            this.links.push({
                type: 'link', label: 'Cuenta', url: '/account', children: [
                    { type: 'link', label: ClabelRutas.Dashboard, url: Crutas.Dashboard },
                    { type: 'link', label: ClabelRutas.EditarCuenta, url: Crutas.EditarCuenta },
                    { type: 'link', label: ClabelRutas.MiHistorial, url: Crutas.MiHistorial },
                    { type: 'link', label: ClabelRutas.MisDirecciones, url: Crutas.MisDirecciones },
                    { type: 'link', label: ClabelRutas.Cotrasena, url: Crutas.Cotrasena },
                    { type: 'link', label: ClabelRutas.CerrarSesion, url: Crutas.CerrarSesion }
                ]
            });

        } else {

            this.links.push({
                type: 'link', label: 'Cuenta', url: '/account/login', children: [
                    { type: 'link', label: ClabelRutas.loguin, url: Crutas.loguin }
                ]
            });

        }

    }

    CargarAdicionales() {

        //cargar moneda
        this.links.push({
            type: 'button', label: 'Moneda', children: [
                { type: 'button', label: '$ Peso Colombia', data: { currency: 'COP' } },
            ]
        });

        //cargar idioma
        this.links.push({
            type: 'button', label: 'Idioma', children: [
                { type: 'button', label: 'Español', data: { language: 'ES' } },
            ]
        });

    }

    CargarCategorias() {

        this.articulossvc.getMegaMenu$().subscribe(menu => {

            const index = this.links.findIndex(x => x.label === 'Categorias');

            this.links[index].children = []

            this.articulossvc.getMegaMenu().forEach((element) => {

                // llenar detalles categorias
                let childrens = this.articulossvc.getMegaMenu().filter(x => x.label === element.label).map(map => {

                    return map.menu['columns'][0]['items']

                });

                this.links[index].children.push({
                    type: 'link',
                    label: element.label,
                    url: this.root.shop() + '/' + element.slug,
                    children: childrens[0].map(child => { return ({ type: 'link', label: child.label, url: this.root.shop() + '/' + child.slug }) })

                })

            });

        });

    }

}
