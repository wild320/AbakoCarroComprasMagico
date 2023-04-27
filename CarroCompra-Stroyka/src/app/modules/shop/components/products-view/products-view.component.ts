import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { PageCategoryService } from '../../services/page-category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

// Servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

// modelos
import { Products} from '../../../../../data/modelos/articulos/DetalleArticulos';


export type Layout = 'grid'|'grid-with-features'|'list';

@Component({
    selector: 'app-products-view',
    templateUrl: './products-view.component.html',
    styleUrls: ['./products-view.component.scss']
})
export class ProductsViewComponent implements OnInit, OnDestroy {
    @Input() layout: Layout = 'grid';
    @Input() grid: 'grid-3-sidebar'|'grid-4-full'|'grid-5-full' = 'grid-3-sidebar';
    @Input() offcanvas: 'always'|'mobile' = 'mobile';

    destroy$: Subject<void> = new Subject<void>();

    listOptionsForm: FormGroup;
    filtersCount = 0;
    ProductosSeleccionados ;
    Productos = new Products();
    PaginationLocalStorage : any;
    isPageAuto = false

    private sub: any;
    private sub2: any;
    private sub3: any;

    constructor(
        private fb: FormBuilder,
        public sidebar: ShopSidebarService,
        public pageService: PageCategoryService,
        public articulossvc: ArticulosService,
    ) {
        //****ShowPageServices From and Page

        // recuperar todos los articulos
        this.sub3 = this.articulossvc.getArticulos$().subscribe(articulos => {
            this.articulossvc.setAtributosFiltros(this.articulossvc.getArticulos().products);
        });

        // recuperar solo los articulos seleccionados
        this.sub2 = this.articulossvc.getArticulosSeleccionados$().subscribe(articulos => {
            // if (!this.ProductosSeleccionados) {
                this.Productos = this.articulossvc.getArticulos().products;
                this.ProductosSeleccionados = this.isPageAuto ? JSON.parse(localStorage.getItem('ProductosSeleccionados')) : this.articulossvc.getArticulosSeleccionados();
                
                localStorage.setItem('ProductosSeleccionados',JSON.stringify(this.ProductosSeleccionados))
                localStorage.setItem('is_page_update','0')
                this.isPageAuto = false;

            // }
        });

    }

    OnCLickOnChange(){
        this.isPageAuto = false
        const value = this.listOptionsForm.value;

        localStorage.setItem('page', JSON.stringify(value))

        value.limit = parseFloat(value.limit);

        if (value.page  == null || value.limit == null || value.sort == null  ){
            return;
        }

        this.SetLIstaOpciones(value);


        this.articulossvc.setAtributosFiltros( this.articulossvc.getAtributosFiltros());

    }

    ngOnInit(): void {

        this.sub = this.articulossvc.getAtributos$().subscribe(atributos => {
            this.SetAtributos();
        });
        
        this.PaginationLocalStorage =  JSON.parse(localStorage.getItem('page'))
        this.isPageAuto = localStorage.getItem('is_page_update') === '1' ? true : false

        if(this.isPageAuto){
            this.listOptionsForm = this.fb.group({
                page:   this.fb.control(this.PaginationLocalStorage?.page || 1) ,
                limit: this.fb.control(this.PaginationLocalStorage?.limit || 12),
                sort: this.fb.control(this.PaginationLocalStorage?.sort  || 'sku'),
            });
            this.SetLIstaOpciones(this.listOptionsForm.value)
        }else{

            this.listOptionsForm = this.fb.group({
                page:   this.fb.control(this.articulossvc.getAtributosFiltros().page),
                limit: this.fb.control(this.articulossvc.getAtributosFiltros().limit),
                sort: this.fb.control(this.articulossvc.getAtributosFiltros().sort),
            });
        }
        
    }

    SetAtributos(){
        if (this.isPageAuto) {
            const total = this.articulossvc.getAtributosFiltros().total;
            this.articulossvc.getAtributosFiltros().pages = Math.ceil(total / this.limit.value);
            this.articulossvc.getAtributosFiltros().from = ((this.page.value - 1) * this.limit.value) + 1 ;
            this.articulossvc.getAtributosFiltros().to = this.page.value   * this.limit.value;
        }else {
            this.page.setValue(this.articulossvc.getAtributosFiltros()?.page, {emitEvent: false});
            this.limit.setValue(this.articulossvc.getAtributosFiltros()?.limit, {emitEvent: false});
            this.sort.setValue(this.articulossvc.getAtributosFiltros()?.sort, {emitEvent: false});
        }
    }

  

    SetLIstaOpciones(value: any){
        const products = this.articulossvc.getArticulos().products.items
        if(value.sort === 'sku'){
            if (products != undefined) {

                products.sort(function (a, b) {
                
                if (a.sku > b.sku) {
                    return 1;
                }
                if (a.sku < b.sku) {
                    return -1;
                }
            
                return 0;
                });
        
            }
            this.ProductosSeleccionados  = products
        }
        if(value.sort === 'name_asc'){
            if (products != undefined) {

                products.sort(function (a, b) {
                
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
            
                return 0;
                });
        
            }
            this.ProductosSeleccionados  = products
        }
        if(value.sort === 'name_desc'){
            if (products != undefined) {

                products.sort(function (a, b) {
                
                if (a.name < b.name) {
                    return 1;
                }
                if (a.name > b.name) {
                    return -1;
                }
            
                return 0;
                });
        
            }
            this.ProductosSeleccionados  = products
        }
     
        const total = this.articulossvc.getAtributosFiltros().total;
        const limit = value.limit;
        this.page.setValue(value.page)

        this.articulossvc.getAtributosFiltros().page = value.page;
        this.articulossvc.getAtributosFiltros().limit = limit;
        this.articulossvc.getAtributosFiltros().sort = value.sort;
        this.articulossvc.getAtributosFiltros().pages = Math.ceil(total / limit);
        this.articulossvc.getAtributosFiltros().from = ((value.page - 1) * value.limit) + 1 ;
        this.articulossvc.getAtributosFiltros().to = value.page   * limit;

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.sub.unsubscribe();
        this.sub2.unsubscribe();
        this.sub3.unsubscribe();
    }

    setLayout(value: Layout): void {
        this.layout = value;
    }

    resetFilters(): void {
        //
    }

    get page() { return this.listOptionsForm.get('page'); }
    get limit() { return this.listOptionsForm.get('limit'); }
    get sort() { return this.listOptionsForm.get('sort'); }
}
