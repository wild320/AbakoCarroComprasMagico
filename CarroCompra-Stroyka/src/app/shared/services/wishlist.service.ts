import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
// import { Product } from '../interfaces/product';
import { map, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
// Contantes
import { CServicios } from '../../../data/contantes/cServicios';

// modelos
import { Item } from 'src/data/modelos/articulos/Items';
import { LocalService } from './local-service.service';
import { LoginClienteResponse } from 'src/data/modelos/seguridad/LoginClienteResponse';
import { UsuarioService } from './usuario.service';
import { NegocioService } from './negocio.service';
import { ServiceHelper } from './ServiceHelper';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
    private itemsSubject$: BehaviorSubject<Item[]> = new BehaviorSubject([]);
    private onAddingSubject$: Subject<Item> = new Subject();
    private UrlServicioFavoritos: string;
    private UrlServicio: string;
    usr
    private token = 'token';
    private itemsFavoritos :any =[];

    readonly items$: Observable<Item[]> = this.itemsSubject$.pipe(takeUntil(this.destroy$));
    readonly onAdding$: Observable<Item> = this.onAddingSubject$.asObservable();
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(this.itemsFavoritos.length);
    readonly count$: Observable<number> = this.quantitySubject$.asObservable();
    constructor(
        @Inject(PLATFORM_ID)
        private platformId: any,
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

    CargarUsuario() {
        this.usr = this.localService.getJsonValue(this.token) ?? this.localService.getJsonValueSession(this.token);

    }



    add(product: Item) {
        this.CargarUsuario();
        if (!this.usr) {
            this.toastr.error(`Para agregar un producto a lista de deseos debe iniciar sesión `);

        } else {
            const productrequest = {
                "proceso": "NEW",
                "IdPersona": parseInt(this.usr.IdPersona),
                "dllFavorito": [
                    {
                        "idArticulo": product.id
                    }
                ]
            }
            this.UrlServicioFavoritos = this.negocio.configuracion.UrlServicioCarroCompras + CServicios.ApiCarroCompras + CServicios.ServicioFavoritos;

            return this.servicehelper
                .PostData(this.UrlServicioFavoritos, productrequest)
                .toPromise()
                .then(result => {
                    if (result.mensaje.msgId == 1) {
                        this.onAddingSubject$.next(product);
                        this.load();
                    } else {
                        this.toastr.error(`El producto no fue agregado a la lista de favoritos`);
                    }
                })
                .catch((err: any) => {
                    console.error(err);
                });
        }

    }

    remove(product: Item) {
    const index =   this.itemsFavoritos.findIndex(item => item.id === product.id);
    this.itemsFavoritos.splice(index, 1)
    this.itemsSubject$.next(this.itemsFavoritos);
    localStorage.setItem("favoritos", JSON.stringify(this.itemsFavoritos))
    this.quantitySubject$.next(this.itemsFavoritos.length);
       const productrequest = {
        "proceso": "DEL",
        "IdPersona": parseInt(this.usr.IdPersona),
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


  
    private load() {
        this.CargarUsuario();
        if (!this.usr) {
            this.toastr.error(`Para agregar un producto a lista de deseos debe iniciar sesión `);

        } else {
            const productrequest = {
                "proceso": "GET",
                "IdPersona": parseInt(this.usr.IdPersona),
                "dllFavorito": [
                    {
                        "idArticulo": 0
                    }
                ]
            }
            this.UrlServicioFavoritos = this.negocio.configuracion.UrlServicioCarroCompras + CServicios.ApiCarroCompras + CServicios.ServicioFavoritos;

            return this.servicehelper
                .PostData(this.UrlServicioFavoritos, productrequest)
                .toPromise()
                .then(result => {
                    const items = result.favoritos.map(element => {
                        this.UrlServicio =
                            this.negocio.configuracion.UrlServicioCarroCompras +
                            CServicios.ApiCarroCompras +
                            CServicios.ServicioRecuperarArticulosDetalle;
                        return this.httpClient.get(`${this.UrlServicio}/${this.usr.IdEmp}/${element.idArticulo}`)
                            .toPromise()
                            .then((config: any) => {
                              if(this.itemsFavoritos.findIndex(item=>
                                item.id == config.articulo.id )==-1){
                                this.itemsFavoritos.push(config.articulo)
                                this.quantitySubject$.next(this.itemsFavoritos.length);
                                localStorage.setItem("favoritos", JSON.stringify(this.itemsFavoritos))
                                }
                            });
                            
                    })
                    this.itemsSubject$.next(this.itemsFavoritos);
                    
                    
                })
                .catch((err: any) => {
                    console.error(err);
                });
        }

        // const items = localStorage.getItem('wishlistItems');
        /* 
                if (items) {
                    this.data.items = JSON.parse(items);
                    this.itemsSubject$.next(this.data.items);
                } */

    }


  
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
