
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DirectionService } from '../../../shared/services/direction.service';
import { FormBuilder, FormGroup } from '@angular/forms';


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
import { Products} from '../../../../data/modelos/articulos/DetalleArticulos';
import { Filters } from '../../../../data/modelos/articulos/filters';

interface FormFilterValues {
    [filterSlug: string]: [number, number] | {[itemSlug: string]: boolean} | string;
}

@Component({
    selector: 'app-widget-filters',
    templateUrl: './widget-filters.component.html',
    styleUrls: ['./widget-filters.component.scss']
})
export class WidgetFiltersComponent implements OnInit, OnDestroy {
    @Input() offcanvas: 'always'|'mobile' = 'mobile';

    destroy$: Subject<void> = new Subject<void>();


    filters: Filters[];
    filtersForm: FormGroup;
    isPlatformBrowser = isPlatformBrowser(this.platformId);
    ArticulosSuscribe$: any;
    rightToLeft = false;
    Productos = new Products();

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private direction: DirectionService,
        private fb: FormBuilder,
        public root: RootService,
        public pageCategory: PageCategoryService,
        public articulossvc: ArticulosService,
    ) {
        this.rightToLeft = this.direction.isRTL();

    }

    ngOnInit(): void {

        // recuperar todos los articulos
        this.ArticulosSuscribe$ = this.articulossvc.getArticulos$().subscribe(articulos => {

            this.filters = this.articulossvc.getArticulos().products.filters;

            this.filtersForm = this.makeFiltersForm(this.articulossvc.getArticulos().products.filters);

            this.descuento.setValue('Any');

            this.filtersForm.valueChanges.subscribe(formValues => {
                this.articulossvc.SetFiltrarArticulos (this.convertFormToFilterValues(this.filters, formValues));
            });

        });

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.ArticulosSuscribe$.unsubscribe();
    }

    trackBySlug(index: number, item: {slug: string}): any {
        return item.slug;
    }

    makeFiltersForm(filtro: Filters[]): FormGroup {
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

    makeListFilterForm(filter: any): FormGroup {
        const group = {};

        filter.items.forEach(item => {
            const control = this.fb.control(filter.value.includes(item.slug));

            // A timeout is needed because sometimes a state change is ignored if performed immediately.
            setTimeout(() => {
                if (this.isItemDisabled(filter, item)) {
                    control.disable({emitEvent: false});
                } else {
                    control.enable({emitEvent: false});
                }
            }, 0);

            group[item.slug] = control;
        });

        return this.fb.group(group);
    }

    isItemDisabled(filter: CheckFilter|RadioFilter|ColorFilter, item: FilterItem|ColorFilterItem): boolean {
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
}
