import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { posts } from '../../../data/blog-posts';
import { ShopService } from '../../shared/api/shop.service';
import { BlockHeaderGroup } from '../../shared/interfaces/block-header-group';
import { Brand } from '../../shared/interfaces/brand';
import { Category } from '../../shared/interfaces/category';

// Modelos
import { Item } from '../../../data/modelos/articulos/Items';

// Servivios
import { ArticulosService } from '../../shared/services/articulos.service';
import { StoreService } from '../../shared/services/store.service';

// Contantes
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BlocksModule } from 'src/app/modules/blocks/blocks.module';
import { CArticulos } from '../../../data/contantes/cArticulosList';
import { Title } from '@angular/platform-browser';
import { NegocioService } from 'src/app/shared/services/negocio.service';

interface ProductsCarouselGroup extends BlockHeaderGroup {
    products: Item[];
}

interface ProductsCarouselData {
    abort$: Subject<void>;
    loading: boolean;
    products: Item[];
    groups: ProductsCarouselGroup[];
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [BlocksModule, CommonModule],
    templateUrl: './page-home-one.component.html',
    styleUrls: ['./page-home-one.component.scss']
})
export class PageHomeOneComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject<void>();
    bestsellers: Item[] = [];
    brands: Brand[];
    popularCategories: Category[];

    columnTopRated: Item[] | any;
    columnSpecialOffers: Item[];
    columnBestsellers: Item[] | any;

    posts = posts;

    featuredProducts: ProductsCarouselData;
    latestProducts: ProductsCarouselData;
    productsOferta: ProductsCarouselData

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private shop: ShopService,
        private articulossvc: ArticulosService,
        public StoreSvc: StoreService,
        private titleService: Title,
        private negocio: NegocioService
    ) {         
        
        this.titleService.setTitle(this.negocio.configuracion.NombreCliente);
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {


            // Recuperar los artoculos mas vendidos
            this.recuperarMasVendidos();

            // recuperar si no ha recuperado aun
            this.recuperarDestacados();

            // recuperar articulos reciete llegados
            this.recuperarRecienLlegados();

            // organziar categorias populares
            this.CategoriasPopulares();

            // organizar mascas populares
            this.MarcasPopulares();

            // REcuperar Ofertas Especiales
            this.recuperarOfertasEspeciales();

            // recuperar mejor valorados
            this.recuperarMejorValorados();
        }


    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    CategoriasPopulares() {

        // Recuperar los articulos mas vendidos si ya fueron recuperados
        if (this.articulossvc.RecuperarCategoriasPopulares){
            this.popularCategories = this.articulossvc.getCategoriasPopulares();
        }else{

            this.articulossvc.RecuperarGetCategoriasPopulares();

            // tslint:disable-next-line: deprecation
            this.articulossvc.getCategoriasPopulares$().subscribe(data => {
                this.popularCategories = this.articulossvc.getCategoriasPopulares();
            });
        }

    }

    MarcasPopulares() {

        // Recuperar los articulos mas vendidos si ya fueron recuperados
        if (this.articulossvc.RecuperarMarcasPopulares){
            this.brands = this.articulossvc.getMarcasPopulares();
        }else{

            this.articulossvc.RecuperarGetMarcasPopulares();

            // tslint:disable-next-line: deprecation
            this.articulossvc.getMarcasPopulares$().subscribe(data => {
                this.brands = this.articulossvc.getMarcasPopulares();
            });
        }

    }

    recuperarDestacados() {

        // Recuperar los articulos mas vendidos si ya fueron recuperados
        if (this.articulossvc.RecuperoDestacados){
            this.organizarArticulosDestacados();
        }else{

            this.articulossvc.RecuperarArticulosEspeciales(CArticulos.ArticulosDestacados);

            // tslint:disable-next-line: deprecation
            this.articulossvc.getArticulosDestacados$().subscribe(data => {
                this.organizarArticulosDestacados();
            });
        }

    }

    recuperarRecienLlegados() {


        // Recuperar los articulos mas vendidos si ya fueron recuperados
        if (this.articulossvc.RecuperarRecienLlegados){
            this.organizarArticulosRecienLlegados();
        }else{

            this.articulossvc.RecuperarArticulosEspeciales(CArticulos.ArticulosRecienLlegados);

            // tslint:disable-next-line: deprecation
            this.articulossvc.getArticulosRecienLlegados$().subscribe(data => {
                this.organizarArticulosRecienLlegados();
            });
        }

    }

    organizarArticulosDestacados() {

        this.featuredProducts = {
            abort$: new Subject<void>(),
            loading: false,
            products: [],
            groups: this.OrganizarGrupo(this.articulossvc.getArticulosDestacados()),
        };

        this.groupChangeDestacados(this.featuredProducts, this.featuredProducts.groups[0]);

    }

    organizarArticulosRecienLlegados() {

        this.latestProducts = {
            abort$: new Subject<void>(),
            loading: false,
            products: [],
            groups: this.OrganizarGrupo(this.articulossvc.getArticulosRecienLlegados()),
        };

        this.groupChangeRecienLlegdos(this.latestProducts, this.latestProducts.groups[0]);

    }

    organizarOfertas() {
        this.productsOferta= {
            abort$: new Subject<void>(),
            loading: false,
            products: [],
            groups: this.OrganizarGrupo(this.articulossvc.getArticulosOfertasEspeciales()),
        };

        this.groupChangeOferta(this.productsOferta, this.productsOferta.groups[0]);

    }

    OrganizarGrupo(articulos: Item[]): ProductsCarouselGroup[] {

        const marcas: ProductsCarouselGroup[] = [];

        // agregar el todosp or defecto
        marcas.push({
            name: 'Todos',
            current: true,
            products: articulos,
        });

        // agrupar por marca
        articulos.forEach(art => {

            if (marcas.findIndex(i => i.name === art.marca) === -1) {
                marcas.push({
                    name: art.marca,
                    current: false,
                    products: articulos.filter(ft => ft.marca === art.marca),
                });
            }

        });

        return marcas;
    }

    recuperarMasVendidos() {

        // Recuperar los articulos mas vendidos si ya fueron recuperados
        if (this.articulossvc.RecuperoMasVendidos){
            this.bestsellers = this.articulossvc.getArticulosMasVendidos().slice(0 , 7);
            this.columnBestsellers = this.articulossvc.getArticulosMasVendidos().slice(1 , 4);
        }else{

            this.articulossvc.RecuperarArticulosEspeciales(CArticulos.ArticulosEspecialesMasVendidos);

            // tslint:disable-next-line: deprecation
            this.articulossvc.getArticulosMasVendidos$().subscribe(data => {
                this.bestsellers = this.articulossvc.getArticulosMasVendidos().slice(0 , 7);
                this.columnBestsellers = this.articulossvc.getArticulosMasVendidos().slice(1 , 4);
            });
        }
    }

    recuperarOfertasEspeciales() {

        // Recuperar los articulos mas vendidos si ya fueron recuperados
        if (this.articulossvc.RecuperarOfertasEspeciales) {
            this.articulossvc.getArticulosOfertasEspeciales();
            this.organizarOfertas()

        } else {

            this.articulossvc.RecuperarArticulosEspeciales(CArticulos.ArticulosOfertasEspeciales);

            // tslint:disable-next-line: deprecation
            this.articulossvc.getArticulosOfertasEspeciales$().subscribe(data => {
                this.organizarOfertas()
            });
        }
    }

    recuperarMejorValorados() {

        // Recuperar los articulos mas vendidos si ya fueron recuperados
        if (this.articulossvc.RecuperarMejorValorados){
            this.columnTopRated = this.articulossvc.getArticulosMejorValorados().slice(0 , 3);

        }else{

            this.articulossvc.RecuperarArticulosEspeciales(CArticulos.ArticulosMejorValorados);

            // tslint:disable-next-line: deprecation
            this.articulossvc.getArticulosMejorValorados$().subscribe(data => {
                this.columnTopRated = this.articulossvc.getArticulosMejorValorados().slice(0 , 3);
            });
        }
    }


    groupChangeDestacados(carousel: ProductsCarouselData, group: ProductsCarouselGroup | any): void {

        carousel.loading = true;

        if (group.products !== null) {
            this.featuredProducts.products = group.products;
        }

        carousel.loading = false;
    }

    groupChangeRecienLlegdos(carousel: ProductsCarouselData, group: ProductsCarouselGroup | any): void {

        carousel.loading = true;

        if (group.products !== null) {
            this.latestProducts.products = group.products;
        }

        carousel.loading = false;
    }

    groupChangeOferta(carousel: ProductsCarouselData, group: ProductsCarouselGroup | any): void {

        carousel.loading = true;

        if (group.products !== null) {
            this.productsOferta.products = group.products;
        }

        carousel.loading = false;
    }
}
