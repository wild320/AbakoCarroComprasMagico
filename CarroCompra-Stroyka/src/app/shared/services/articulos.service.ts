
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

// interfaces
import {SerializedFilterValues} from '../../shared/interfaces/filter';
import { NavigationLink } from '../../shared/interfaces/navigation-link';
import { Category } from '../../shared/interfaces/category';
import { Brand } from '../../shared/interfaces/brand';

// Contantes
import { CServicios } from 'src/data/contantes/cServicios';
import { CTipoFiltros } from 'src/data/contantes/cTipoFiltros';

// Servicios
import { UsuarioService } from '../services/usuario.service';
import { NegocioService } from '../../shared/services/negocio.service';

// Modelos
import {ArticulosCarroComprasResponse } from '../../../data/modelos/articulos/Articulos';
import { Products} from '../../../data/modelos/articulos/DetalleArticulos';
import { Filters } from '../../../data/modelos/articulos/filters';
import { ItemsFiltros} from '../../../data/modelos/articulos/ItemsFiltros';
import {Item} from '../../../data/modelos/articulos/Items';
import {ArticuloSeleccionado} from '../../../data/modelos/articulos/ArticuloSeleccionado';

// constantes
import {cFiltros} from '../../../data/contantes/Cfiltros';
import {CArticulos} from '../../../data/contantes/CArticulos';



@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private UrlServicio: string;
  private megaMenu$ = new Subject<NavigationLink[]>();
  private megaMenu: NavigationLink[];
  private Articulos$ = new Subject<ArticulosCarroComprasResponse>();
  private Articulos: ArticulosCarroComprasResponse;
  private ArticulosSeleccionados$ = new Subject<Products>();
  private ArticulosSeleccionados: Products;
  private ArticulosRelacionados$ = new Subject<Item[]>();
  private ArticulosRelacionados: Item[];
  private ArticulosBusqueda$ = new Subject<Item[]>();
  private ArticulosBusqueda: Item[];
  private Articulosfiltrados: Products = new Products();
  private AtributosFiltros = new Products();
  private AtributosFiltros$ = new Subject<Products>();
  private AtributosMasVendidos: Item[];
  private AtributosMasVendidos$ = new Subject<Item[]>();
  private AtributosDestacados$ = new Subject<Item[]>();
  private AtributosOfertasEspeciales: Item[];
  private AtributosOfertasEspeciales$ = new Subject<Item[]>();
  private AtributosMejorValorados: Item[];
  private AtributosMejorValorados$ = new Subject<Item[]>();
  private AtributosDestacados: Item[];
  private AtributosRecienLlegados$ = new Subject<Item[]>();
  private AtributosRecienLlegados: Item[];
  private CategoriasPopulares$ = new Subject<Category[]>();
  private CategoriasPopulares: Category[];
  private MarcasPopulares$ = new Subject<Brand[]>();
  private MarcasPopulares: Brand[];
  private seleccionado = new ArticuloSeleccionado();
  private ArticulosDetalle: ArticuloSeleccionado;
  private ArticulosDetalle$ = new Subject<ArticuloSeleccionado>();
  private FiltrosCarro: Filters[];
  private FiltrosCarro$ = new Subject<Filters[]>();
  private IdempresaCLienteLogueada: number;
  private isfiltrado = false ;
  private FiltroMarca: ItemsFiltros[];
  private FiltroColores: ItemsFiltros[];
  private FiltroDescuento: ItemsFiltros[];


  // isLoading
  public isLoadingState = false;
  public RecuperoDestacados = false;
  public RecuperoMasVendidos = false;
  public RecuperarRecienLlegados = false;
  public SuscribirBusquedaArticulos = false;
  public RecuperarCategoriasPopulares = false;
  public RecuperarMarcasPopulares = false;
  public RecuperarOfertasEspeciales = false;
  public RecuperarMejorValorados = false;
  private isLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoadingState);

  isLoading$: Observable<boolean> = this.isLoadingSource.asObservable();

  constructor(public usuariosvc: UsuarioService,
              private httpClient: HttpClient,
              private negocio: NegocioService,
    ) {

      // tslint:disable-next-line: deprecation
      this.usuariosvc.getEstadoLoguin$().subscribe(() => {

        if ((this.IdempresaCLienteLogueada === undefined && this.usuariosvc.Idempresa === undefined) || this.IdempresaCLienteLogueada === 0){
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

  setAtributosFiltros(Seleccion: any){

    this.setAtributos$(Seleccion);
    this.ArticulosSeleccionPagina();

  }

  setAtributos$(newValue){

    this.AtributosFiltros = newValue;
    this.AtributosFiltros$.next(newValue);

  }

  getAtributos$(): Observable<Products> {
    return this.AtributosFiltros$.asObservable();
  }

  getArticulosMasVendidos(): Item[] {
    return this.AtributosMasVendidos;
  }

  setArticulosMasVendidos$(newValue){
    this.RecuperoMasVendidos = true;
    this.AtributosMasVendidos = newValue;
    this.AtributosMasVendidos$.next(newValue);
  }

  getArticulosMasVendidos$(): Observable<Item[]> {
    return this.AtributosMasVendidos$.asObservable();
  }

  getCategoriasPopulares(): Category[] {
    return this.CategoriasPopulares;
  }

  setCategoriasPopulares$(newValue){
    this.RecuperarCategoriasPopulares = true;
    this.CategoriasPopulares = newValue;
    this.CategoriasPopulares$.next(newValue);
  }

  getCategoriasPopulares$(): Observable<Category[]> {
    return this.CategoriasPopulares$.asObservable();
  }

  getMarcasPopulares(): Brand[] {
    return this.MarcasPopulares;
  }

  setMarcasPopulares$(newValue){
    this.RecuperarMarcasPopulares = true;
    this.MarcasPopulares = newValue;
    this.MarcasPopulares$.next(newValue);
  }

  getMarcasPopulares$(): Observable<Brand[]> {
    return this.MarcasPopulares$.asObservable();
  }


  getArticulosRecienLlegados(): Item[] {
    return this.AtributosRecienLlegados;
  }

  setArticulosRecienLlegados$(newValue){
    this.RecuperarRecienLlegados = true;
    this.AtributosRecienLlegados = newValue;
    this.AtributosRecienLlegados$.next(newValue);
  }

  getArticulosRecienLlegados$(): Observable<Item[]> {
    return this.AtributosRecienLlegados$.asObservable();
  }

  getArticulosOfertasEspeciales(): Item[] {
    return this.AtributosOfertasEspeciales;
  }

  setArticulosOfertasEspeciales$(newValue){
    this.RecuperarOfertasEspeciales = true;
    this.AtributosOfertasEspeciales = newValue;
    this.AtributosOfertasEspeciales$.next(newValue);
  }

  getArticulosOfertasEspeciales$(): Observable<Item[]> {
    return this.AtributosOfertasEspeciales$.asObservable();
  }

  getArticulosMejorValorados(): Item[] {
    return this.AtributosMejorValorados;
  }

  setArticulosMejorValorados$(newValue){
    this.RecuperarMejorValorados = true;
    this.AtributosMejorValorados = newValue;
    this.AtributosMejorValorados$.next(newValue);
  }

  getArticulosMejorValorados$(): Observable<Item[]> {
    return this.AtributosMejorValorados$.asObservable();
  }


  setArticulosDestacados$(newValue){
    this.RecuperoDestacados = true;
    this.AtributosDestacados = newValue;
    this.AtributosDestacados$.next(newValue);
  }

  getArticulosDestacados(): Item[] {
    return this.AtributosDestacados;
  }


  getArticulosDestacados$(): Observable<Item[]> {
    return this.AtributosDestacados$.asObservable();
  }

  getArticuloDetalle(): ArticuloSeleccionado {
    return this.ArticulosDetalle;
  }

  setArticuloDetalle$(newValue){
    this.ArticulosDetalle = newValue;
    this.ArticulosDetalle$.next(newValue);
  }

  getArticuloDetalle$(): Observable<ArticuloSeleccionado> {
    return this.ArticulosDetalle$.asObservable();
  }

  SetSeleccionarArticuloDetalle(idArticulo: number, SiempreRecuperar: boolean ){
    // Si el articulo no existe aun debe consultarlo a la api
    if (this.getArticulos()?.products === undefined || SiempreRecuperar){
      this.RecuperarArticuloDetalle(idArticulo);

    }else if (this.getArticulos().products.items.findIndex(element =>  element.id ===  idArticulo) == -1 ) {
      this.RecuperarArticuloDetalle(idArticulo);


    }else{
      const index = this.getArticulos().products.items.findIndex(element =>  element.id ===  idArticulo);
      this.seleccionado.item = this.getArticulos().products.items[index];
      this.seleccionado.breadcrumbs = this.getArticulos().breadcrumbs;
      this.setArticuloDetalle$(this.seleccionado);
    }

  }

  setFitrosCarro$(newValue){

   this.FiltrosCarro = newValue;
   this.FiltrosCarro$.next(newValue);

  }

  getFiltrosCarro$(): Observable<Filters[]> {
   return this.FiltrosCarro$.asObservable();
  }

  getFiltrosCarro(): Filters[] {
    return this.FiltrosCarro;
  }

  getAtributosFiltros(): Products {
    return this.AtributosFiltros;
  }

  private ArticulosSeleccionPagina(){

    const inicial = this.AtributosFiltros.from - 1 ;
    const final = this.AtributosFiltros.to;

    if (this.isfiltrado) {

      this.setArticulosSeleccionados$ (this.Articulosfiltrados.items.slice(inicial , final));


    }else{

      this.setArticulosSeleccionados$ (this.Articulos.products.items.slice(inicial , final));

    }

  }

  setIsLoading(value: boolean): void {
    this.isLoadingState = value;
    this.isLoadingSource.next(value);
  }

  setMegaMenu$(newValue): void {
    this.megaMenu = newValue;
    this.megaMenu$.next(newValue);
  }

  getMegaMenu$(): Observable<NavigationLink[]> {
    return this.megaMenu$.asObservable();
  }

  getMegaMenu(): NavigationLink[] {
    return this.megaMenu;
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

  SetFiltrarArticulos(filtros: SerializedFilterValues): void {

    this.Articulosfiltrados = JSON.parse(JSON.stringify(this.getArticulos().products));
    this.isfiltrado = false;
    const tipoFiltro = [];

    if (filtros.price !== undefined) {
      this.filtrarPorPrecio(filtros);
      tipoFiltro.push(cFiltros.Precio);
    }

    if (filtros.brand !== undefined) {
      this.filtrarPorMarca(filtros);
      tipoFiltro.push(cFiltros.Marca);
    }

    if (filtros.discount !== undefined && filtros.discount.length) {
      this.filtrarPorDescuento(filtros);
      tipoFiltro.push(cFiltros.Descuento);
    }

    if (filtros.color !== undefined) {
      this.filtrarPorColor(filtros);
      tipoFiltro.push(cFiltros.Color);
    }

    this.actualizarFiltros(tipoFiltro);
  }

  filtrarPorPrecio(filtros: SerializedFilterValues): void {
    const [precioInicial, precioFinal] = filtros.price.split('-').map(parseFloat);
    this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((articulo) => {
      return articulo.price >= precioInicial && articulo.price <= precioFinal;
    });
    this.isfiltrado = true;
  }

  filtrarPorMarca(filtros: SerializedFilterValues): void {
    const filtrosMarcasSeleccionadas = filtros.brand.split(',');
    this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((articulo) => {
      return filtrosMarcasSeleccionadas.includes(articulo.marca);
    });
    this.isfiltrado = true;
  }

  filtrarPorDescuento(filtros: SerializedFilterValues): void {
    this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((articulo) => {
      return articulo.tieneDescuento === filtros.discount;
    });
      this.isfiltrado = true;
      this.isfiltrado = true;

    this.isfiltrado = true;

  }

  filtrarPorColor(filtros: SerializedFilterValues): void {
    const filtrosColoresSeleccionadas = filtros.color.split(',');
    this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((articulo) => {
      return filtrosColoresSeleccionadas.includes(articulo.color);
    });
    this.isfiltrado = true;
  }

  actualizarFiltros(tipoFiltro: string[]): void {
    const total = this.Articulosfiltrados.items.length;
    const productos = this.getArticulos().products;
    const limit = productos.limit;

    this.Articulosfiltrados.page = 1;
    this.Articulosfiltrados.limit = limit;
    this.Articulosfiltrados.pages = Math.ceil(total / limit);
    this.Articulosfiltrados.total = total;
    this.Articulosfiltrados.from = 1;
    this.Articulosfiltrados.to = limit;

    this.SetRecalcularFiltros(tipoFiltro);
    this.setAtributos$(this.Articulosfiltrados);
    this.ArticulosSeleccionPagina();
  }

  SetRecalcularFiltros(tipoFiltro: string[]): void {
    
    const filtroMarca = this.calculateMarcaFilters(this.Articulosfiltrados.items);
    const filtroColores = this.calculateColorFilters(this.Articulosfiltrados.items);
    const filtroDescuento = this.calculateDescuentoFilters(this.Articulosfiltrados.items);

    this.updateFilters(filtroMarca, 'Marca', tipoFiltro);
    this.updateFilters(filtroColores, 'Color', tipoFiltro);
    this.updateFilters(filtroDescuento, 'Descuento', tipoFiltro);
    
    this.setFitrosCarro$(this.Articulosfiltrados.filters);
  }
  
  private calculateMarcaFilters(items: any[]): any[] {
    const filtroMarca = [];
    items.forEach(articulo => {
      const indexMarca = filtroMarca.findIndex(element => element.name === articulo.marca);
      if (indexMarca >= 0) {
        filtroMarca[indexMarca].count += 1;
      } else {
        filtroMarca.push({ id: articulo.idMarca, name: articulo.marca, slug: articulo.marca, count: 1 });
      }
    });
    return filtroMarca;
  }

  private calculateColorFilters(items: any[]): any[] {
    const filtroColores = [];
    items.forEach(articulo => {
      const indexColores = filtroColores.findIndex(element => element.name === articulo.color);
      if (indexColores >= 0) {
        filtroColores[indexColores].count += 1;
      } else {
        filtroColores.push({ id: 0, name: articulo.color, slug: articulo.color, count: 1, color: articulo.colorhx });
      }
    });
    return filtroColores;
  }

  private calculateDescuentoFilters(items: any[]): any[] {

    const totalDescuentos = items.length;
    const filters = [{ id: 0, name: 'Todos', slug: 'Todos', count: totalDescuentos }];

    items.forEach(articulo => {
      const indexdesc = filters.findIndex(element => element.name === articulo.tieneDescuento);
      if (indexdesc >= 0) {
        filters[indexdesc].count += 1;
      } else {
        filters.push({ id: 0, name: articulo.tieneDescuento, slug: articulo.tieneDescuento, count: 1 });
      }
    });
    return filters;
  }

  private updateFilters(filtroToUpdate: any[], filtroSlug: string, tipoFiltro: string[]): void {
    const indexfiltros = this.Articulosfiltrados.filters.findIndex(element => element.slug === filtroSlug);
    if (tipoFiltro.findIndex(ft => ft === filtroSlug) >= 0) {
      this.Articulosfiltrados.filters[indexfiltros].items = filtroToUpdate;
    } 
    
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

  setArticulosRelacionados$(newValue): void {
    this.ArticulosRelacionados = newValue;
    this.ArticulosRelacionados$.next(newValue);
  }

  getArticulosRelacionados$(): Observable<Item[]> {
    return this.ArticulosRelacionados$.asObservable();
  }

  getArticulosRelacionados(): Item[] {
    return this.ArticulosRelacionados;
  }

  setArticulosBusqueda$(newValue): void {
    this.SuscribirBusquedaArticulos = true;
    this.ArticulosBusqueda = newValue;
    this.ArticulosBusqueda$.next(newValue);
  }

  getArticulosBusqueda$(): Observable<Item[]> {
    return this.ArticulosBusqueda$.asObservable();
  }

  getArticulosBusqueda(): Item[] {
    return this.ArticulosBusqueda;
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
          this.RecuperarArticulosEspeciales(CArticulos.ArticulosEspecialesMasVendidos);

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
      this.usuariosvc.Idempresa = 0;
    }

    const TipoFiltro  = slug.split('|')[0];
    const Id          = this.GetIdFiltro(TipoFiltro, slug);
    const IdEmpresa   = this.usuariosvc.Idempresa.toString();
    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${TipoFiltro}/${Id}`, { responseType: 'text' })
        .toPromise()
        .then((config: any) => {
          this.setFitrosCarro$(JSON.parse(config).products.filters);

          const articulos = JSON.parse(config);

          this.setArticulos$(articulos);
          this.setIsLoading(false);

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }

  public RecuperarArticulosEspeciales(Tipo: string){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServicioRecuperarEspecialesVendidos;

    if (!this.usuariosvc.Idempresa ) {
      this.usuariosvc.Idempresa  = 0;
    }

    const IdEmpresa   = this.usuariosvc.Idempresa.toString();


    return this.httpClient.get(`${this.UrlServicio}/${Tipo}/${IdEmpresa}`, { responseType: 'text' })
        .toPromise()
        .then((art: any) => {
          const {items} = JSON.parse(art);



          switch (Tipo) {
            case CArticulos.ArticulosEspecialesMasVendidos:
              this.setArticulosMasVendidos$(items);
              break;

            case CArticulos.ArticulosDestacados:
              this.setArticulosDestacados$(items);
              break;

            case CArticulos.ArticulosRecienLlegados:
                this.setArticulosRecienLlegados$(items);
                break;

            case CArticulos.ArticulosOfertasEspeciales:
              this.setArticulosOfertasEspeciales$(items);
              break;

            case CArticulos.ArticulosMejorValorados:
              this.setArticulosMejorValorados$(items);
              break;
          }

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }

  public RecuperarArticulosRelacionados(Idarticulo: number){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServicioRecuperarArticulosRelacionados;

    if (!this.usuariosvc.Idempresa ) {
      this.usuariosvc.Idempresa  = 0;
    }

    const IdEmpresa   = this.usuariosvc.Idempresa.toString();
    const TipoRelacionado = 'DETREL'

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${TipoRelacionado}/${IdEmpresa}/${Idarticulo}`, { responseType: 'text' })
        .toPromise()
        .then((art: any) => {

          const {items} = JSON.parse(art);

          this.setArticulosRelacionados$ (items);

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }

  public RecuperarArticulosBusqueda(Busqueda: string){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServicioRecuperarArticulosBusqueda;

    if (!this.usuariosvc.Idempresa ) {
      this.usuariosvc.Idempresa  = 0;
    }

    const IdEmpresa   = this.usuariosvc.Idempresa.toString();

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${Busqueda}`, { responseType: 'text' })
        .toPromise()
        .then((art: any) => {

          const {items} = JSON.parse(art);

          this.setArticulosBusqueda$ (items);

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }

  public RecuperarGetCategoriasPopulares(){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServicioCategoriasPopulares;

    if (!this.usuariosvc.Idempresa ) {
      this.usuariosvc.Idempresa  = 0;
    }

    const IdEmpresa   = this.usuariosvc.Idempresa.toString();

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}`, { responseType: 'text' })
        .toPromise()
        .then((cat: any) => {

          const {categorias}  = JSON.parse(cat);

          this.setCategoriasPopulares$(categorias);

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }

  public RecuperarGetMarcasPopulares(){
    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServicioMarcasPopulares;

    if (!this.usuariosvc.Idempresa ) {
      this.usuariosvc.Idempresa  = 0;
    }

    const IdEmpresa   = this.usuariosvc.Idempresa.toString();

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}`, { responseType: 'text' })
        .toPromise()
        .then((mar: any) => {

          const {marcas}  = JSON.parse(mar);

          this.setMarcasPopulares$(marcas);

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }

  public RecuperarArticuloDetalle(Id: number){

    this.UrlServicio =
        this.negocio.configuracion.UrlServicioCarroCompras +
        CServicios.ApiCarroCompras +
        CServicios.ServicioRecuperarArticulosDetalle;

    if (!this.usuariosvc.Idempresa ) {
      this.usuariosvc.Idempresa = 0;
    }

    const IdEmpresa  = this.usuariosvc.Idempresa.toString();
    const IdArticulo = Id.toString();

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${IdArticulo}`, { responseType: 'text' })
        .toPromise()
        .then((art: any) => {

          const {articulo} = JSON.parse(art);
          const {breadcrumbs} = JSON.parse(art);

          this.seleccionado.item = articulo;
          this.seleccionado.breadcrumbs = breadcrumbs;

          this.setArticuloDetalle$(this.seleccionado);

        })
        .catch((err: any) => {

          this.setIsLoading(false);
          console.log ('Error al consumir servicio:' + err.message);

        });

  }

}
