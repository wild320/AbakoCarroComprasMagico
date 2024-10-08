
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DirectionService } from '../../../shared/services/direction.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';


import {
    ColorFilter,
    ColorFilterItem,
    SerializedFilterValues,
    CheckFilter,
    FilterItem, RadioFilter
} from '../../../shared/interfaces/filter';
import { RootService } from '../../../shared/services/root.service';
import { Subject } from 'rxjs';
import { PageCategoryService } from '../../shop/services/page-category.service';

// Servicios
import { ArticulosService } from '../../../shared/services/articulos.service';

// Modelos
import { Products } from '../../../../data/modelos/articulos/DetalleArticulos';
import { StoreService } from 'src/app/shared/services/store.service';
import { map, tap } from 'rxjs/operators';
import { Filters } from 'src/data/modelos/articulos/Filters';


interface FormFilterValues {
    [filterSlug: string]: [number, number] | { [itemSlug: string]: boolean } | string;
}

@Component({
    selector: 'app-widget-filters',
    templateUrl: './widget-filters.component.html',
    styleUrls: ['./widget-filters.component.scss']
})
export class WidgetFiltersComponent implements OnInit, OnDestroy {
    @Input() offcanvas: 'always' | 'mobile' = 'mobile';

    destroy$: Subject<void> = new Subject<void>();


    filters: Filters[];
    filtersForm: UntypedFormGroup;
    filtrosValores: SerializedFilterValues = {};
    isPlatformBrowser: boolean;
    ArticulosSuscribe$: any;
    rightToLeft = false;
    Productos = new Products();
    showFilterMarcas: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private direction: DirectionService,
        private fb: UntypedFormBuilder,
        public root: RootService,
        public pageCategory: PageCategoryService,
        public articulossvc: ArticulosService,
        public storeSv: StoreService
    ) {
        this.platformId = platformId;
        this.isPlatformBrowser = isPlatformBrowser(this.platformId);

        this.rightToLeft = this.direction.isRTL();
        this.showFilterMarcas = this.storeSv.configuracionSitio.VerFiltroMarcas

    }

    ngOnInit(): void {

        // // recuperar todos los filtros
        // this.ArticulosSuscribe$ = this.articulossvc.getFiltrosCarro$().pipe(
        //     map(filtros => this.showFilterMarcas ? filtros : filtros.filter(filtro => filtro.name !== 'Marca')),
        //     tap(filtros => {
        //         this.filters = filtros;
        //         this.filtersForm = this.makeFiltersForm(filtros);
        //         this.UpdateValuesSeleted();
        //     })
        // ).subscribe();       

    }

    restoreOtherFilters() {
        this.ChangeForm()
    }

    ChangeForm() {
        this.filtrosValores = this.convertFormToFilterValues(this.filters, this.filtersForm.value);
        // this.articulossvc.SetFiltrarArticulos(this.filtrosValores);
    }

    UpdateValuesSeleted() {

        const formValues = {};
        let filtrosMarcasSeleccionadas = [];
        let filtrosColorSeleccionados = [];

        // si tiene filtro de marca lo guarda en un array
        if (this.filtrosValores['brand']) {
            filtrosMarcasSeleccionadas = this.filtrosValores['brand'].split(',');
        }

        // si tiene filtro de color lo guarda en un array
        if (this.filtrosValores['color']) {
            filtrosColorSeleccionados = this.filtrosValores['color'].split(',');
        }

        this.filters.forEach(filter => {
            switch (filter.type) {
                case 'range':
                    if (this.filtrosValores['price']) {
                        formValues[filter.slug] = this.filtrosValores['price'].split('-').map(pr => Number(pr));
                    } else {
                        formValues[filter.slug] = [filter.min, filter.max];
                    }
                    break;
                case 'check':

                    formValues[filter.slug] = {};

                    filter.items.forEach(item => {

                        if (filtrosMarcasSeleccionadas.includes(item.slug)) {
                            formValues[filter.slug][item.slug] = true;
                        } else {
                            formValues[filter.slug][item.slug] = false;
                        }

                    });
                    break;

                case 'color':

                    formValues[filter.slug] = {};

                    filter.items.forEach(item => {

                        if (filtrosColorSeleccionados.includes(item.slug)) {
                            formValues[filter.slug][item.slug] = true;
                        } else {
                            formValues[filter.slug][item.slug] = false;
                        }

                    });
                    break;

                case 'radio':
                    if (this.filtrosValores['discount']) {
                        formValues[filter.slug] = this.filtrosValores['discount'];
                    } else {
                        formValues[filter.slug] = filter.items[0].slug;
                    }

                    break;
            }
        });
        this.filtersForm.setValue(formValues);

    }

    ngOnDestroy(): void {
        this.destroy$.next();        
        this.destroy$.complete();
    }

    trackBySlug(index: number, item: { slug: string }): any {
        return item.slug;
    }

    makeFiltersForm(filtro: Filters[]): UntypedFormGroup {
        const filtersFromGroup = {};

        filtro.forEach(filter => {
            switch (filter.type) {
                case 'range':
                case 'radio':
                    filtersFromGroup[filter.slug] = this.fb.control(filter.value);
                    break;
                case 'check':
                case 'color':
                    filtersFromGroup[filter.slug] = this.makeListFilterForm(filter);
                    break;
            }
        });

        return this.fb.group(filtersFromGroup);
    }

    makeListFilterForm(filter: any): UntypedFormGroup {
        const group = {};

        filter.items.forEach(item => {
            const control = this.fb.control(filter.value.includes(item.slug));

            // A timeout is needed because sometimes a state change is ignored if performed immediately.
            setTimeout(() => {
                if (this.isItemDisabled(filter, item)) {
                    control.disable({ emitEvent: false });
                } else {
                    control.enable({ emitEvent: false });
                }
            }, 0);

            group[item.slug] = control;
        });

        return this.fb.group(group);
    }

    isItemDisabled(filter: CheckFilter | RadioFilter | ColorFilter | any, item: FilterItem | ColorFilterItem): boolean {
        return item.count === 0 && (filter.type === 'radio' || !filter.value.includes(item.slug));
    }

    convertFormToFilterValues(filters: Filters[], formValues: FormFilterValues): SerializedFilterValues {
        const filterValues: SerializedFilterValues = {};

        filters.forEach(filter => {
            const formValue = formValues[filter.slug];

            switch (filter.type) {
                case 'range':
                    if (formValue && (formValue[0] !== filter.min || formValue[1] !== filter.max)) {
                        filterValues[filter.slug] = `${formValue[0]}-${formValue[1]}`;
                    }
                    break;
                case 'check':
                case 'color':
                    const filterFormValues = formValue as object || {};

                    filter.value.forEach(filterValue => {
                        if (!(filterValue in filterFormValues)) {
                            filterFormValues[filterValue] = true;
                        }
                    });

                    const values = Object.keys(filterFormValues).filter(x => filterFormValues[x]);

                    if (values.length > 0) {
                        filterValues[filter.slug] = values.join(',');
                    }
                    break;
                case 'radio':
                    if (formValue !== filter.items[0].slug) {
                        filterValues[filter.slug] = formValue as string;
                    }

                    break;
            }
        });

        return filterValues;
    }

    reset(): void {

        this.filtrosValores = {};
       // this.articulossvc.SetFiltrarArticulos(this.filtrosValores);

        const formValues = {};

        this.filters.forEach(filter => {
            switch (filter.type) {
                case 'range':
                    formValues[filter.slug] = [filter.min, filter.max];
                    break;
                case 'check':
                case 'color':
                    formValues[filter.slug] = {};

                    filter.items.forEach(item => {
                        formValues[filter.slug][item.slug] = false;
                    });
                    break;
                case 'radio':
                    formValues[filter.slug] = filter.items[0].slug;
                    break;
            }
        });

        this.filtersForm.setValue(formValues);
    }

    get descuento() { return this.filtersForm.get('discount'); }
    get color() { return this.filtersForm.get('color'); }
    get marca() { return this.filtersForm.get('brand'); }
    get precio() { return this.filtersForm.get('price'); }

}
