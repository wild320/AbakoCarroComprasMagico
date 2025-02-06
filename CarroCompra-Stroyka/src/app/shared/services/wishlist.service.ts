import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { CServicios } from '../../../data/contantes/cServicios';
import { Item } from '../../../data/modelos/articulos/Items';
import { ServiceHelper } from './ServiceHelper';
import { LocalService } from './local-service.service';
import { NegocioService } from './negocio.service';
import { UsuarioService } from './usuario.service';

interface WishlistData {
    items: Item[];
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService implements OnDestroy {
    private data: WishlistData = { items: [] };
    private destroy$: Subject<void> = new Subject();
    private itemsSubject$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    private onAddingSubject$: Subject<Item> = new Subject();
    private UrlServicioFavoritos: string;
    private dataUserLoged: any;
    private token = 'token';
    private itemsFavoritos: Item[] = [];

    readonly items$: Observable<Item[]> = this.itemsSubject$.asObservable().pipe(takeUntil(this.destroy$));
    readonly onAdding$: Observable<Item> = this.onAddingSubject$.asObservable();
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject<number>(this.itemsFavoritos.length);
    readonly count$: Observable<number> = this.quantitySubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private toastr: ToastrService,
        private usuarioService: UsuarioService,
        private localService: LocalService,
        private negocioService: NegocioService,
        private httpClient: HttpClient,
        private serviceHelper: ServiceHelper<any, any>
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
        }
    }

    private async loadUserData() {
        if (isPlatformBrowser(this.platformId)) {
            const user = this.localService.getJsonValue(this.token) ?? this.localService.getJsonValueSession(this.token);
            this.dataUserLoged = JSON.parse(user) ?? null;
        }
    }

    async add(product: Item) {
        if (!this.dataUserLoged) {
            this.toastr.error('Para agregar un producto a la lista de deseos debe iniciar sesión');
            return;
        }

        const productRequest = {
            proceso: 'NEW',
            IdPersona: parseInt(this.dataUserLoged.IdEmp),
            dllFavorito: [{ idArticulo: product.id }]
        };

        this.UrlServicioFavoritos = `${this.negocioService.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioFavoritos}`;

        try {
            const result = await this.serviceHelper.PostData(this.UrlServicioFavoritos, productRequest).toPromise();

            if (result.mensaje.msgId === 1) {
                this.onAddingSubject$.next(product);
                this.load();
            } else {
                this.toastr.error('El producto no fue agregado a la lista de favoritos');
            }
        } catch (err) {
            console.error('Error al agregar producto a la lista de deseos:', err);
            this.toastr.error('Ocurrió un error al intentar agregar el producto a la lista de favoritos');
        }
    }

    remove(product: Item): Observable<any> {
        const index = this.itemsFavoritos.findIndex(item => item.id === product.id);
        if (index === -1) {
            console.warn('Producto no encontrado en la lista de favoritos');
            return of(null);
        }

        this.itemsFavoritos.splice(index, 1);
        this.itemsFavoritos.sort((a, b) => a.sku.localeCompare(b.sku));
        this.itemsSubject$.next(this.itemsFavoritos);
        localStorage.setItem("favoritos", JSON.stringify(this.itemsFavoritos));
        this.quantitySubject$.next(this.itemsFavoritos.length);

        const productRequest = {
            proceso: "DEL",
            IdPersona: parseInt(this.dataUserLoged?.IdEmp ?? '0'),
            dllFavorito: [{ idArticulo: product.id }]
        };

        this.toastr.success('El producto fue eliminado correctamente');

        this.UrlServicioFavoritos = `${this.negocioService.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioFavoritos}`;

        return this.httpClient.post(this.UrlServicioFavoritos, productRequest).pipe(
            tap(() => console.log("Producto eliminado del servidor correctamente")),
            catchError(error => {
                console.error("Error al eliminar producto del servidor:", error);
                return throwError(() => error);
            })
        );
    }

    private async load() {
        try {
            await this.loadUserData();

            if (!this.dataUserLoged) {
                this.toastr.error('Para agregar un producto a la lista de deseos debe iniciar sesión');
                return;
            }

            const productRequest = {
                proceso: 'GET',
                IdPersona: parseInt(this.dataUserLoged?.IdEmp ?? '0'),
                dllFavorito: [{ idArticulo: 0 }]
            };

            this.UrlServicioFavoritos = `${this.negocioService.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioFavoritos}`;

            const result = await firstValueFrom(this.serviceHelper.PostData(this.UrlServicioFavoritos, productRequest));

            const favoritosPromises = result.favoritos.map(async (element: any) => {
                const articuloUrl = `${this.negocioService.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioRecuperarArticulosDetalle}/${this.dataUserLoged.IdEmp}/${element.idArticulo}`;

                try {
                    const config: any = await firstValueFrom(this.httpClient.get(articuloUrl));

                    if (!this.itemsFavoritos.some(item => item.id === config.articulo.id)) {
                        this.itemsFavoritos.push(config.articulo);
                    }
                } catch (error) {
                    console.error('Error al obtener detalle del artículo:', error);
                }
            });

            await Promise.all(favoritosPromises);

            // Ordenar los favoritos por SKU solo una vez después de cargarlos todos
            this.itemsFavoritos.sort((a, b) => (a.sku ?? '').localeCompare(b.sku ?? ''));

            // Actualizar almacenamiento local y emitir cambios
            localStorage.setItem('favoritos', JSON.stringify(this.itemsFavoritos));
            this.itemsSubject$.next(this.itemsFavoritos);
            this.quantitySubject$.next(this.itemsFavoritos.length);

        } catch (err) {
            console.error('Error al cargar favoritos:', err);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
