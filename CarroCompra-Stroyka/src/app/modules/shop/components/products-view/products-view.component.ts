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
    ProductosSeleccionados = new Products();
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

    ngOnInit(): void {

        this.articulossvc.getAtributos$().subscribe(atributos => {
            this.SetAtributos();
        });

        this.listOptionsForm = this.fb.group({
            page:   this.fb.control(this.articulossvc.AtributosFiltros.page),
            limit: this.fb.control(this.articulossvc.AtributosFiltros.limit),
            sort: this.fb.control(this.articulossvc.AtributosFiltros.sort),
        });

        this.listOptionsForm.valueChanges.subscribe(value => {

            value.limit = parseFloat(value.limit);

            if (value.page  == null || value.limit == null || value.sort == null  ){
                return;
            }

            this.SetLIstaOpciones(value);

            this.articulossvc.setAtributosFiltros( this.articulossvc.AtributosFiltros);

        });

    }

    SetAtributos(){
        this.page.setValue(this.articulossvc.AtributosFiltros?.page, {emitEvent: false});
        this.limit.setValue(this.articulossvc.AtributosFiltros?.limit, {emitEvent: false});
        this.sort.setValue(this.articulossvc.AtributosFiltros?.sort, {emitEvent: false});
    }

    SetLIstaOpciones(value: any){

        const total = this.articulossvc.AtributosFiltros.total;
        const limit = value.limit;

        this.articulossvc.AtributosFiltros.page = value.page;
        this.articulossvc.AtributosFiltros.limit = limit;
        this.articulossvc.AtributosFiltros.sort = value.sort;
        this.articulossvc.AtributosFiltros.pages = Math.ceil(total / limit);
        this.articulossvc.AtributosFiltros.from = ((value.page - 1) * value.limit) + 1 ;
        this.articulossvc.AtributosFiltros.to = value.page   * limit;

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
