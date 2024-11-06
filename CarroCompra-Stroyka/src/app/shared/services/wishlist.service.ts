import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CServicios } from '../../../data/contantes/cServicios';
import { ServiceHelper } from './ServiceHelper';
import { LocalService } from './local-service.service';
import { NegocioService } from './negocio.service';
import { UsuarioService } from './usuario.service';
import { Item } from '../../../data/modelos/articulos/Items';

interface WishlistData {
    items: Item[];
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService implements OnDestroy {
    private data: WishlistData = {
        items: []
    };

    private destroy$: Subject<void> = new Subject();
    private itemsSubject$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    private onAddingSubject$: Subject<Item> = new Subject();
    private UrlServicioFavoritos: string;
    private UrlServicio: string;
    private dataUserLoged: any;
    private token = 'token';
    private itemsFavoritos: any = [];

    readonly items$: Observable<Item[]> = this.itemsSubject$.asObservable().pipe(takeUntil(this.destroy$));
    readonly onAdding$: Observable<Item> = this.onAddingSubject$.asObservable();
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(this.itemsFavoritos.length);
    readonly count$: Observable<number> = this.quantitySubject$.asObservable();




    constructor(
        @Inject(PLATFORM_ID)
        private platformId: Object,
        private toastr: ToastrService,
        public usuariosvc: UsuarioService,
        private localService: LocalService,
        private negocio: NegocioService,
        private httpClient: HttpClient,
        private servicehelper: ServiceHelper<any, any>,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
        }
    }



    async CargarUsuario() {
        if (isPlatformBrowser(this.platformId)) {
            const usr = this.localService.getJsonValue(this.token) ?? this.localService.getJsonValueSession(this.token);
            this.dataUserLoged = JSON.parse(usr) ?? null;
        }
    }



    async add(product: Item) {

        if (!this.dataUserLoged) {
            this.toastr.error('Para agregar un producto a lista de deseos debe iniciar sesión');
            return;
        }

        const productRequest = {
            proceso: 'NEW',
            IdPersona: parseInt(this.dataUserLoged.IdEmp),
            dllFavorito: [{ idArticulo: product.id }]
        };

        this.UrlServicioFavoritos = `${this.negocio.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioFavoritos}`;

        try {
            const result = await this.servicehelper.PostData(this.UrlServicioFavoritos, productRequest).toPromise();

            if (result.mensaje.msgId === 1) {
                this.onAddingSubject$.next(product);
                this.load();
            } else {
                this.toastr.error('El producto no fue agregado a la lista de favoritos');
            }
        } catch (err) {
            console.error('Error adding product to wishlist:', err);
            this.toastr.error('Ocurrió un error al intentar agregar el producto a la lista de favoritos');
        }
    }


    remove(product: Item) {
        const index = this.itemsFavoritos.findIndex(item => item.id === product.id);
        this.itemsFavoritos.splice(index, 1)
        this.itemsSubject$.next(this.itemsFavoritos);
        localStorage.setItem("favoritos", JSON.stringify(this.itemsFavoritos))
        this.quantitySubject$.next(this.itemsFavoritos.length);
        const productrequest = {
            "proceso": "DEL",
            "IdPersona": parseInt(this.dataUserLoged.IdEmp),
            "dllFavorito": [
                {
                    "idArticulo": product.id
                }
            ]
        }
        //  this.onAddingSubject$.next(product);
        this.toastr.error(`El producto fue eliminado correctamente`);
        this.UrlServicioFavoritos = this.negocio.configuracion.UrlServicioCarroCompras + CServicios.ApiCarroCompras + CServicios.ServicioFavoritos;
        return this.httpClient.post(this.UrlServicioFavoritos, productrequest)
    }



    private async load() {
        try {
            // Cargar usuario y manejar si no está logueado
            this.CargarUsuario();
            if (!this.dataUserLoged) {
                this.toastr.error('Para agregar un producto a lista de deseos debe iniciar sesión');
                return; // Si no hay usuario logueado, salir de la función
            }
    
            // Preparar request para obtener los favoritos
            const productRequest = {
                proceso: 'GET',
                IdPersona: parseInt(this.dataUserLoged?.IdEmp ?? '0'),
                dllFavorito: [{ idArticulo: 0 }]
            };
    
            // Construir URL del servicio de favoritos
            this.UrlServicioFavoritos = `${this.negocio.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioFavoritos}`;
            
            // Realizar petición para obtener los productos favoritos
            const result = await this.servicehelper.PostData(this.UrlServicioFavoritos, productRequest).toPromise();
    
            // Iterar sobre los productos favoritos y obtener detalles
            const favoritosPromises = result.favoritos.map(async (element: any) => {
                // URL para obtener detalles del artículo
                const articuloUrl = `${this.negocio.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioRecuperarArticulosDetalle}/${this.dataUserLoged.IdEmp}/${element.idArticulo}`;
                
                try {
                    const config: any = await this.httpClient.get(articuloUrl).toPromise();
                    
                    // Verificar si el artículo ya está en favoritos
                    if (!this.itemsFavoritos.some(item => item.id === config.articulo.id)) {
                        this.itemsFavoritos.push(config.articulo);
                        this.quantitySubject$.next(this.itemsFavoritos.length);
                        localStorage.setItem('favoritos', JSON.stringify(this.itemsFavoritos));
                    }
                } catch (error) {
                    console.error('Error al obtener detalle del artículo:', error);
                }
            });
    
            // Esperar a que se resuelvan todas las promesas
            await Promise.all(favoritosPromises);
    
            // Emitir los nuevos favoritos
            this.itemsSubject$.next(this.itemsFavoritos);
    
        } catch (err) {
            // Manejo de errores generales
            console.error('Error al cargar favoritos:', err);
        }
    }
    



    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
