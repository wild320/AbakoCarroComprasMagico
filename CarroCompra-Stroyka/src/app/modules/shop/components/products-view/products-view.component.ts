import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { PageCategoryService } from '../../services/page-category.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

// Servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { Products } from '../../../../../data/modelos/articulos/DetalleArticulos';
import { Item } from 'src/data/modelos/articulos/Items';
import { isPlatformBrowser } from '@angular/common';


export type Layout = 'grid' | 'grid-with-features' | 'list';

@Component({
    selector: 'app-products-view',
    templateUrl: './products-view.component.html',
    styleUrls: ['./products-view.component.scss']
})
export class ProductsViewComponent implements OnInit, OnDestroy {

    @Input() layout: Layout = 'grid';
    @Input() grid: 'grid-3-sidebar' | 'grid-4-full' | 'grid-5-full' = 'grid-3-sidebar';
    @Input() offcanvas: 'always' | 'mobile' = 'mobile';

    destroy$: Subject<void> = new Subject<void>();

    listOptionsForm: UntypedFormGroup;
    filtersCount: number = 0;
    ProductosSeleccionados: Item[] | any;
    Productos: Products = new Products();
    PaginationLocalStorage: any;
    isPageAuto: boolean = false

    private sub: Subscription;
    private sub2: Subscription;
    private sub3: Subscription;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private fb: UntypedFormBuilder,
        public sidebar: ShopSidebarService,
        public pageService: PageCategoryService,
        public articulossvc: ArticulosService,
        private cdr: ChangeDetectorRef
    ) {
        // if (isPlatformBrowser(this.platformId)) {
        //     console.log('Platform', this.platformId);
        //     this.articulossvc.getArticulos$().subscribe(articulos => {
        //         console.log("productos", articulos.products)
        //        this.articulossvc.setAtributosFiltros(articulos.products);
        //         console.log(articulos, 'articulos')
        //     });
    
        //     this.articulossvc.getArticulosSeleccionados$().subscribe(articulos => {
    
        //         this.Productos = this.articulossvc.getArticulos().products;
        //         this.ProductosSeleccionados = this.articulossvc.getArticulosSeleccionados();
    
        //         console.log("console 59", this.ProductosSeleccionados);
        //         localStorage.setItem('ProductosSeleccionados', JSON.stringify(this.ProductosSeleccionados))
        //         localStorage.setItem('is_page_update', '0')
        //         this.isPageAuto = false;
          
    
        //     });


        // }





    }

    OnCLickOnChange() {
        // if (isPlatformBrowser(this.platformId)) {
        //     this.isPageAuto = false
        //     const value = this.listOptionsForm.value;

        //     localStorage.setItem('page', JSON.stringify(value))

        //     value.limit = parseFloat(value.limit);

        //     if (value.page == null || value.limit == null || value.sort == null) {
        //         return;
        //     }

        //     this.SetLIstaOpciones(value);


        //     this.articulossvc.setAtributosFiltros(this.articulossvc.getAtributosFiltros());
        //     // Agregar detección de cambios
        //     this.cdr.detectChanges();
        // }


    }

    ngOnInit(): void {
        // if (isPlatformBrowser(this.platformId)) {
        //     this.sub = this.articulossvc.getAtributos$().subscribe(atributos => {
        //         this.SetAtributos();
        //     });

        //     this.PaginationLocalStorage = JSON.parse(localStorage.getItem('page'))
        //     this.isPageAuto = localStorage.getItem('is_page_update') === '1' ? true : false

        //     if (this.isPageAuto) {
        //         this.listOptionsForm = this.fb.group({
        //             page: this.fb.control(this.PaginationLocalStorage?.page || 1),
        //             limit: this.fb.control(this.PaginationLocalStorage?.limit || 12),
        //             sort: this.fb.control('sku'),
        //         });
        //         this.SetLIstaOpciones(this.listOptionsForm.value)
        //     } else {

        //         this.listOptionsForm = this.fb.group({
        //             page: this.fb.control(this.articulossvc.getAtributosFiltros().page),
        //             limit: this.fb.control(this.articulossvc.getAtributosFiltros().limit),
        //             sort: this.fb.control('sku'),
        //         });
        //     }
        // }



    }

    SetAtributos() {
        // if (this.isPageAuto) {
        //     const total = this.articulossvc.getAtributosFiltros().total;
        //     this.articulossvc.getAtributosFiltros().pages = Math.ceil(total / this.limit.value);
        //     this.articulossvc.getAtributosFiltros().from = ((this.page.value - 1) * this.limit.value) + 1;
        //     this.articulossvc.getAtributosFiltros().to = this.page.value * this.limit.value;
        // } else {
        //     this.page.setValue(this.articulossvc.getAtributosFiltros()?.page, { emitEvent: false });
        //     this.limit.setValue(this.articulossvc.getAtributosFiltros()?.limit, { emitEvent: false });
        //     this.sort.setValue(this.articulossvc.getAtributosFiltros()?.sort, { emitEvent: false });
        // }
    }

    SetLIstaOpciones(value: any): void {
        // const products = this.articulossvc.getArticulos()?.products?.items;

        // if (!products) {
        //     return;
        // }

        // const sortFunctions = {
        //     'sku': (a: any, b: any) => a.sku.localeCompare(b.sku),
        //     'name_asc': (a: any, b: any) => a.name.localeCompare(b.name),
        //     'name_desc': (a: any, b: any) => b.name.localeCompare(a.name)
        // };

        // const sortFunction = sortFunctions[value.sort];
        // if (sortFunction) {
        //     products.sort(sortFunction);
        // }

        // this.ProductosSeleccionados = products;

        // const total = this.articulossvc.getAtributosFiltros().total;
        // const limit = value.limit;
        // const page = value.page;

        // const atributosFiltros = this.articulossvc.getAtributosFiltros();
        // atributosFiltros.page = page;
        // atributosFiltros.limit = limit;
        // atributosFiltros.sort = value.sort;
        // atributosFiltros.pages = Math.ceil(total / limit);
        // atributosFiltros.from = ((page - 1) * limit) + 1;
        // atributosFiltros.to = page * limit;

        // this.page.setValue(page);
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setLayout(value: Layout): void {
        this.layout = value;
    }

    resetFilters(): void {

    }

    get page() { return this.listOptionsForm.get('page'); }
    get limit() { return this.listOptionsForm.get('limit'); }
    get sort() { return this.listOptionsForm.get('sort'); }
}
