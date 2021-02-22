import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

// interfaces
import {SerializedFilterValues} from '../../shared/interfaces/filter';

// Contantes
import { CServicios } from 'src/data/contantes/cServicios';
import { CTipoFiltros } from 'src/data/contantes/cTipoFiltros';

// Servicios
import { UsuarioService } from '../services/usuario.service';
import { NegocioService } from '../../shared/services/negocio.service';

// interfaces
import { NavigationLink } from '../../shared/interfaces/navigation-link';

// Modelos
import {ArticulosCarroComprasResponse } from '../../../data/modelos/articulos/Articulos';
import { Products} from '../../../data/modelos/articulos/DetalleArticulos';
import { Filters} from '../../../data/modelos/articulos/Filters';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private UrlServicio: string;
  private megaMenu$ = new Subject<NavigationLink[]>();
  private Articulos$ = new Subject<ArticulosCarroComprasResponse>();
  private Articulos: ArticulosCarroComprasResponse;
  private ArticulosSeleccionados$ = new Subject<Products>();
  private ArticulosSeleccionados: Products;
  private Articulosfiltrados: Products;
  public AtributosFiltros = new Products();
  private AtributosFiltros$ = new Subject<Products>();
  private IdempresaCLienteLogueada: number;
  private isfiltrado = false ;

  // isLoading
  public isLoadingState = false;
  private isLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoadingState);

  isLoading$: Observable<boolean> = this.isLoadingSource.asObservable();

  constructor(public usuariosvc: UsuarioService,
              private httpClient: HttpClient,
              private negocio: NegocioService,
    ) {

      this.usuariosvc.getEstadoLoguin$().subscribe((value) => {

        if (this.IdempresaCLienteLogueada === undefined && this.usuariosvc.Idempresa === undefined){
          this.IdempresaCLienteLogueada = 0;
          this.ConsultarDepartamento(0);
        }else{

          if (this.IdempresaCLienteLogueada !== this.usuariosvc.Idempresa){
            this.ConsultarDepartamento(this.usuariosvc.Idempresa);
            this.IdempresaCLienteLogueada = this.usuariosvc.Idempresa;
          }
        }
      });

    }

  setAtributosFiltros(Seleccion: Products){

    this.setAtributos$(Seleccion);
    this.FiltrarArticulosSeleccion();

  }

  setAtributos$(newValue){

    this.AtributosFiltros = newValue;
    this.AtributosFiltros$.next(newValue);

  }

  getAtributos$(): Observable<Products> {
    return this.AtributosFiltros$.asObservable();
  }

  private FiltrarArticulosSeleccion(){

    const inicial = this.AtributosFiltros.from - 1 ;
    const final = this.AtributosFiltros.to;

    if (this.isfiltrado) {

      this.setArticulosSeleccionados$ (this.Articulosfiltrados.items.slice(inicial , final));


    }else{

      this.setArticulosSeleccionados$ (this.Articulos.products.items.slice(inicial , final));

    }

  }

  // set functions
  setIsLoading(value: boolean): void {
    this.isLoadingState = value;
    this.isLoadingSource.next(value);
  }

  setMegaMenu$(newValue): void {
    this.megaMenu$.next(newValue);
  }

  getMegaMenu$(): Observable<NavigationLink[]> {
    return this.megaMenu$.asObservable();
  }

  setArticulos$(newValue): void {
    this.Articulos = newValue;
    this.Articulos$.next(newValue);
  }

  getArticulos$(): Observable<ArticulosCarroComprasResponse> {
    return this.Articulos$.asObservable();
  }

  getArticulos(): ArticulosCarroComprasResponse {
    return this.Articulos;
  }

  SetFiltrarArticulos(filtros: SerializedFilterValues){

    this.Articulosfiltrados = JSON.parse(JSON.stringify(this.Articulos.products));
    this.isfiltrado = false;

    if (filtros.brand !== undefined) {
      console.log (filtros.brand);
    }

    if (filtros.color !== undefined) {
      console.log (filtros.color);
    }

    if (filtros.discount !== undefined) {
      console.log (filtros.discount);

    }

    if (filtros.price !== undefined) {

      const precioInicial = parseFloat (filtros.price.split('-')[0]);
      const precioFinal = parseFloat (filtros.price.split('-')[1]);

      this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((precio) => {
        if (precio.price >= precioInicial && precio.price <=  precioFinal){
          return precio;
        }
      });

      this.isfiltrado = true;

    }

    // cambiar los filtros
    const total = this.Articulosfiltrados.items.length;

    this.Articulosfiltrados.page = 1;
    this.Articulosfiltrados.limit = this.Articulos.products.limit;
    this.Articulosfiltrados.pages = Math.ceil(total / this.Articulos.products.limit);
    this.Articulosfiltrados.total = total;
    this.Articulosfiltrados.from = 1;
    this.Articulosfiltrados.to = this.Articulos.products.limit;

    console.log (this.Articulosfiltrados);

    this.SetRecalcularFiltros();
    this.setAtributos$(this.Articulosfiltrados);
    this.FiltrarArticulosSeleccion();

  }

  SetRecalcularFiltros(){

    const filtros = this.Articulosfiltrados.items.reduce( (contador, item) => {

        return contador + 1;

    }, 0);

    console.log (filtros);

  }

  setArticulosSeleccionados$(newValue): void {
    this.ArticulosSeleccionados = newValue;
    this.ArticulosSeleccionados$.next(newValue);
  }

  getArticulosSeleccionados$(): Observable<Products> {
    return this.ArticulosSeleccionados$.asObservable();
  }

  getArticulosSeleccionados(): Products {
    return this.ArticulosSeleccionados;
  }

  public ConsultarDepartamento(IdEmpresa: number ){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServivioMenu;

    return this.httpClient.get(this.UrlServicio + '/' + IdEmpresa.toString(), { responseType: 'text' })
        .toPromise()
        .then((config: any) => {

          this.setMegaMenu$(JSON.parse(config).megaMenu);

        })
        .catch((err: any) => {

          console.log ('Error al consumir servicio:' + err.message);

        });

  }

  private GetIdFiltro(Filtro: string, Slug: string): string{

    switch (Filtro) {
      case CTipoFiltros.FiltroLinea:
        return Slug.split('|')[1];

      case CTipoFiltros.FiltroCategoria:
        return Slug.split('|')[2];

      case CTipoFiltros.FiltroSegmento:
        return Slug.split('|')[3];

      case CTipoFiltros.FiltroAleatorio:
          return '0';

    }

  }

  public RecuperarArticulos(slug: string){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServicioRecuperarArticulos;

    if (!this.usuariosvc.Idempresa ) {
      return;
    }

    const TipoFiltro  = slug.split('|')[0];
    const Id          = this.GetIdFiltro(TipoFiltro, slug);
    const IdEmpresa   = this.usuariosvc.Idempresa.toString();

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${TipoFiltro}/${Id}`, { responseType: 'text' })
        .toPromise()
        .then((config: any) => {

          this.setArticulos$(JSON.parse(config));
          this.setIsLoading(false);

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }


}
