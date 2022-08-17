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

    constructor(
        private fb: FormBuilder,
        public sidebar: ShopSidebarService,
        public pageService: PageCategoryService,
        public articulossvc: ArticulosService,
    ) {


        // recuperar todos los articulos
        this.articulossvc.getArticulos$().subscribe(articulos => {

            this.articulossvc.setAtributosFiltros(this.articulossvc.getArticulos().products);

        });

        // recuperar solo los articulos seleccionados
        this.articulossvc.getArticulosSeleccionados$().subscribe(articulos => {

            this.Productos = this.articulossvc.getArticulos().products;
            this.ProductosSeleccionados = this.articulossvc.getArticulosSeleccionados();

        });

    }

    OnCLickOnChange(){

        const value = this.listOptionsForm.value;

        value.limit = parseFloat(value.limit);

        if (value.page  == null || value.limit == null || value.sort == null  ){
            return;
        }

        this.SetLIstaOpciones(value);


        this.articulossvc.setAtributosFiltros( this.articulossvc.getAtributosFiltros());

    }

    ngOnInit(): void {

        this.articulossvc.getAtributos$().subscribe(atributos => {
            this.SetAtributos();
        });


        this.listOptionsForm = this.fb.group({
            page:   this.fb.control(this.articulossvc.getAtributosFiltros().page),
            limit: this.fb.control(this.articulossvc.getAtributosFiltros().limit),
            sort: this.fb.control(this.articulossvc.getAtributosFiltros().sort),
        });


     
       /* this.listOptionsForm.valueChanges.subscribe(value => {

            console.log (value);

            value.limit = parseFloat(value.limit);

            if (value.page  == null || value.limit == null || value.sort == null  ){
                return;
            }

            this.SetLIstaOpciones(value);

            console.log('suscribe', value);

            // this.articulossvc.setAtributosFiltros( this.articulossvc.getAtributosFiltros());

        }); */

    }

    SetAtributos(){
        this.page.setValue(this.articulossvc.getAtributosFiltros()?.page, {emitEvent: false});
        this.limit.setValue(this.articulossvc.getAtributosFiltros()?.limit, {emitEvent: false});
        this.sort.setValue(this.articulossvc.getAtributosFiltros()?.sort, {emitEvent: false});
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

     

        const total = this.articulossvc.getAtributosFiltros().total;
        const limit = value.limit;

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
