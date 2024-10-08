
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';

// interfaces
import { Brand } from '../../shared/interfaces/brand';
import { Category } from '../../shared/interfaces/category';
import { SerializedFilterValues } from '../../shared/interfaces/filter';
import { NavigationLink } from '../../shared/interfaces/navigation-link';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';
import { UsuarioService } from '../services/usuario.service';

// Modelos
import { ArticulosCarroComprasResponse } from '../../../data/modelos/articulos/Articulos';
import { ArticuloSeleccionado } from '../../../data/modelos/articulos/ArticuloSeleccionado';
import { Products } from '../../../data/modelos/articulos/DetalleArticulos';

import { Item } from '../../../data/modelos/articulos/Items';
import { ItemsFiltros } from '../../../data/modelos/articulos/ItemsFiltros';
import { cFiltros } from '../../../data/contantes/cfiltros';
import { CServicios } from '../../../data/contantes/cServicios';
import { CTipoFiltros } from '../../../data/contantes/cTipoFiltros';
import { CArticulos } from '../../../data/contantes/cArticulosList';
import { isPlatformBrowser } from '@angular/common';
import { Filters } from 'src/data/modelos/articulos/Filters';



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
  private isfiltrado = false;
  private FiltroMarca: ItemsFiltros[];
  private FiltroColores: ItemsFiltros[];
  private FiltroDescuento: ItemsFiltros[];


  // isLoading
  public isLoadingState = false;
  private isLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoadingState);
  isLoading$: Observable<boolean> = this.isLoadingSource.asObservable();

  public RecuperoDestacados = false;
  public RecuperoMasVendidos = false;
  public RecuperarRecienLlegados = false;
  // public SuscribirBusquedaArticulos = false;
  public RecuperarCategoriasPopulares = false;
  public RecuperarMarcasPopulares = false;
  public RecuperarOfertasEspeciales = false;
  public RecuperarMejorValorados = false;

  constructor(public usuariosvc: UsuarioService,
    private httpClient: HttpClient,
    private negocio: NegocioService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {

      // tslint:disable-next-line: deprecation
      // this.usuariosvc.getEstadoLoguin$().subscribe(() => {

      //   if ((this.IdempresaCLienteLogueada === undefined && this.usuariosvc.Idempresa === undefined) || this.IdempresaCLienteLogueada === 0) {
      //     this.IdempresaCLienteLogueada = 0;
      //     this.ConsultarDepartamento(0);
      //   } else {

      //     if (this.IdempresaCLienteLogueada !== this.usuariosvc.Idempresa) {
      //       this.ConsultarDepartamento(this.usuariosvc.Idempresa);
      //       this.IdempresaCLienteLogueada = this.usuariosvc.Idempresa;
      //     }
      //   }
      // });
    }

  }

  setAtributosFiltros(Seleccion: any) {
    console.log("Seleccion", Seleccion)

    this.setAtributos$(Seleccion);
    this.ArticulosSeleccionPagina();

  }

  setAtributos$(newValue) {

    this.AtributosFiltros = newValue;
    this.AtributosFiltros$.next(newValue);

  }

  getAtributos$(): Observable<Products> {
    return this.AtributosFiltros$.asObservable();
  }

  getArticulosMasVendidos(): Item[] {
    return this.AtributosMasVendidos;
  }

  setArticulosMasVendidos$(newValue) {
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

  setCategoriasPopulares$(newValue) {
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

  setMarcasPopulares$(newValue) {
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

  setArticulosRecienLlegados$(newValue) {
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

  setArticulosOfertasEspeciales$(newValue) {
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

  setArticulosMejorValorados$(newValue) {
    this.RecuperarMejorValorados = true;
    this.AtributosMejorValorados = newValue;
    this.AtributosMejorValorados$.next(newValue);
  }

  getArticulosMejorValorados$(): Observable<Item[]> {
    return this.AtributosMejorValorados$.asObservable();
  }


  setArticulosDestacados$(newValue) {
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

  setArticuloDetalle$(newValue) {
    this.ArticulosDetalle = newValue;
    this.ArticulosDetalle$.next(newValue);
  }

  getArticuloDetalle$(): Observable<ArticuloSeleccionado> {
    return this.ArticulosDetalle$.asObservable();
  }

  SetSeleccionarArticuloDetalle(idArticulo: number, SiempreRecuperar: boolean) {
    // Si el articulo no existe aun debe consultarlo a la api
    if (this.getArticulos()?.products === undefined || SiempreRecuperar) {
      this.RecuperarArticuloDetalle(idArticulo);

    } else if (this.getArticulos().products.items.findIndex(element => element.id === idArticulo) == -1) {
      this.RecuperarArticuloDetalle(idArticulo);


    } else {
      const index = this.getArticulos().products.items.findIndex(element => element.id === idArticulo);
      this.seleccionado.item = this.getArticulos().products.items[index];
      this.seleccionado.breadcrumbs = this.getArticulos().breadcrumbs;
      this.setArticuloDetalle$(this.seleccionado);
    }

  }

  setFiltersCarro$(newValue) {
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

  private ArticulosSeleccionPagina() {
    console.log(this.AtributosFiltros)

    const inicial = this.AtributosFiltros.from - 1;
    const final = this.AtributosFiltros.to;

    if (this.isfiltrado) {

      this.setArticulosSeleccionados$(this.Articulosfiltrados.items.slice(inicial, final));


    } else {

      this.setArticulosSeleccionados$(this.Articulos.products.items.slice(inicial, final));

    }

  }

  setIsLoading(value: boolean): void {
    this.isLoadingState = value;
    this.isLoadingSource.next(value);
  }

  // setMegaMenu$(newValue): void {
  //   this.megaMenu = newValue;
  //   this.megaMenu$.next(newValue);
  // }

  // getMegaMenu$(): Observable<NavigationLink[]> {
  //   return this.megaMenu$.asObservable();
  // }

  // getMegaMenu(): NavigationLink[] {
  //   return this.megaMenu;
  // }

  // setArticulos$(newValue): void {
  //   console.log("setArticulos", newValue);
  //   this.Articulos = newValue;
  //   this.Articulos$.next(newValue);
  // }

  getArticulos$(): Observable<ArticulosCarroComprasResponse> {
    return this.Articulos$.asObservable();
  }

  getArticulos(): ArticulosCarroComprasResponse {
    return this.Articulos;
  }

  // SetFiltrarArticulos(filtros: SerializedFilterValues) {

  //   this.Articulosfiltrados = this.getArticulos()['items'];
  //   console.log("SetFiltrarArticulos", this.Articulosfiltrados)
  //   this.isfiltrado = false;
  //   const tipoFiltro = [];

  //   // Filtrar por precio;
  //   if (filtros['price'] !== undefined) {

  //     tipoFiltro.push(cFiltros.Precio);

  //     const precioInicial = parseFloat(filtros['price'].split('-')[0]);
  //     const precioFinal = parseFloat(filtros['price'].split('-')[1]);

  //     this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((precio) => {
  //       if (precio.price >= precioInicial && precio.price <= precioFinal) {
  //         return precio;
  //       }
  //     });

  //     this.isfiltrado = true;

  //   }

  //   // filtra por las marcas
  //   if (filtros['brand'] !== undefined) {

  //     tipoFiltro.push(cFiltros.Marca);

  //     const filtrosMarcasSeleccionadas = filtros['brand'].split(',');

  //     this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((marca) => {

  //       if (filtrosMarcasSeleccionadas.includes(marca.marca)) {
  //         return (marca);
  //       }

  //       this.isfiltrado = true;

  //     });

  //   }

  //   // filtrar por descuentos
  //   if (filtros['discount'] !== undefined && filtros['discount'].length) {

  //     tipoFiltro.push(cFiltros.Descuento);

  //     this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((articulos) => {
  //       if (articulos.tieneDescuento === filtros['discount']) {
  //         return articulos;
  //       }
  //     });

  //     this.isfiltrado = true;

  //   }

  //   // filtrar por los colores
  //   if (filtros['color'] !== undefined) {

  //     tipoFiltro.push(cFiltros.Color);

  //     const filtrosColoresSeleccionadas = filtros['color'].split(',');

  //     this.Articulosfiltrados.items = this.Articulosfiltrados.items.filter((color) => {

  //       if (filtrosColoresSeleccionadas.includes(color.color)) {
  //         return (color);
  //       }

  //       this.isfiltrado = true;

  //     });
  //   }

  //   // cambiar los filtros
  //   const total = this.Articulosfiltrados.items.length;

  //   this.Articulosfiltrados.page = 1;
  //   this.Articulosfiltrados.limit = this.Articulos.products.limit;
  //   this.Articulosfiltrados.pages = Math.ceil(total / this.Articulos.products.limit);
  //   this.Articulosfiltrados.total = total;
  //   this.Articulosfiltrados.from = 1;
  //   this.Articulosfiltrados.to = this.Articulos.products.limit;

  //   this.SetRecalcularFiltros(tipoFiltro);
  //   this.setAtributos$(this.Articulosfiltrados);
  //   this.ArticulosSeleccionPagina();

  // }

  // SetRecalcularFiltros(TipoFiltro: any) {

  //   this.FiltroColores = [];
  //   this.FiltroMarca = [];
  //   this.FiltroDescuento = [];
  //   let indexfiltros;

  //   // Total Registros
  //   const totalDescuentos = this.Articulosfiltrados.items.reduce((cont, item) => {
  //     return cont += 1;
  //   }, 0);

  //   // Agregar total descuento
  //   this.FiltroDescuento.push(Object.assign({ id: 0, name: 'Todos', slug: 'Todos', count: totalDescuentos }));

  //   // armas de nuevo los objectos de los filtros
  //   this.Articulosfiltrados.items.forEach(articulo => {

  //     // Armar los item filtro marca
  //     const indexMarca = this.FiltroMarca.findIndex(element => element.name === articulo.marca);

  //     if (indexMarca >= 0) {
  //       this.FiltroMarca[indexMarca].count += 1;
  //     } else {
  //       this.FiltroMarca.push(Object.assign({
  //         id: articulo.idMarca, name: articulo.marca, slug: articulo.marca,
  //         count: 1
  //       }));
  //     }

  //     // Armar los item filtro colores
  //     const indexColores = this.FiltroColores.findIndex(element => element.name === articulo.color);

  //     if (indexColores >= 0) {
  //       this.FiltroColores[indexColores].count += 1;
  //     } else {
  //       this.FiltroColores.push(Object.assign({
  //         id: 0, name: articulo.color, slug: articulo.color,
  //         count: 1, color: articulo.colorhx
  //       }));
  //     }

  //     // Armar los item filtro descuento
  //     const indexdesc = this.FiltroDescuento.findIndex(element => element.name === articulo.tieneDescuento);

  //     if (indexdesc >= 0) {
  //       this.FiltroDescuento[indexdesc].count += 1;
  //     } else {
  //       this.FiltroDescuento.push(Object.assign({ id: 0, name: articulo.tieneDescuento, slug: articulo.tieneDescuento, count: 1 }));
  //     }

  //   });

  //   // asignar los objecto a los articulos filtros
  //   // marcas
  //   indexfiltros = this.Articulosfiltrados.filters.findIndex(element => element.slug === cFiltros.Marca);

  //   if (TipoFiltro.findIndex(ft => ft === cFiltros.Marca) === -1) {
  //     this.Articulosfiltrados.filters[indexfiltros].items = this.FiltroMarca;
  //   } else {
  //     this.Articulosfiltrados.filters[indexfiltros].items = this.FiltrosCarro.find(element =>
  //       element.slug === cFiltros.Marca).items;
  //   }

  //   // Colores
  //   indexfiltros = this.Articulosfiltrados.filters.findIndex(element => element.slug === cFiltros.Color);
  //   if (indexfiltros !== -1) {
  //     if (TipoFiltro.findIndex(ft => ft === cFiltros.Color) === -1) {
  //       this.Articulosfiltrados.filters[indexfiltros].items = this.FiltroColores;
  //     } else {
  //       const filtroColor = this.FiltrosCarro.find(element => element.slug === cFiltros.Color);
  //       if (filtroColor) {
  //         this.Articulosfiltrados.filters[indexfiltros].items = filtroColor.items;
  //       }
  //     }
  //   }

  //   // Descuentos
  //   indexfiltros = this.Articulosfiltrados.filters.findIndex(element => element.slug === cFiltros.Descuento);
  //   if (indexfiltros !== -1) {
  //     if (TipoFiltro.findIndex(ft => ft === cFiltros.Descuento) === -1) {
  //       this.Articulosfiltrados.filters[indexfiltros].items = this.FiltroDescuento;
  //     } else {
  //       const filtroDescuento = this.FiltrosCarro.find(element => element.slug === cFiltros.Descuento);
  //       if (filtroDescuento) {
  //         this.Articulosfiltrados.filters[indexfiltros].items = filtroDescuento.items;
  //       }
  //     }
  //   }

  //   this.setFiltersCarro$(this.Articulosfiltrados.filters);

  // }

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

  // setArticulosBusqueda$(newValue): void {
  //   this.SuscribirBusquedaArticulos = true;
  //   this.ArticulosBusqueda = newValue;
  //   this.ArticulosBusqueda$.next(newValue);
  // }

  // getArticulosBusqueda$(): Observable<Item[]> {
  //   return this.ArticulosBusqueda$.asObservable();
  // }

  // getArticulosBusqueda(): Item[] {
  //   return this.ArticulosBusqueda;
  // }

  // public ConsultarDepartamento(IdEmpresa: number) {
  //   console.log(IdEmpresa)
  //   this.UrlServicio =
  //     this.negocio.configuracion.UrlServicioCarroCompras +
  //     CServicios.ApiCarroCompras +
  //     CServicios.ServivioMenu;

  //   return this.httpClient.get(this.UrlServicio + '/' + IdEmpresa.toString())
  //     .toPromise()
  //     .then((config: any) => {

  //       this.setMegaMenu$(config.megaMenu);
  //       this.RecuperarArticulosEspeciales(CArticulos.ArticulosEspecialesMasVendidos);

  //     })
  //     .catch((err: any) => {

  //       console.log('ConsultarDepartamento Error al consumir servicio:' + err.message);

  //     });

  // }

  // private GetIdFiltro(Filtro: string, Slug: string): string {

  //   switch (Filtro) {
  //     case CTipoFiltros.FiltroLinea:
  //       return Slug.split('|')[1];

  //     case CTipoFiltros.FiltroCategoria:
  //       return Slug.split('|')[2];

  //     case CTipoFiltros.FiltroSegmento:
  //       return Slug.split('|')[3];

  //     case CTipoFiltros.FiltroAleatorio:
  //       return '0';


  //   }

  // }

  // public async RecuperarArticulos(slug: string) {
  //   if (isPlatformBrowser(this.platformId)) {
  //   this.UrlServicio =
  //     this.negocio.configuracion.UrlServicioCarroCompras +
  //     CServicios.ApiCarroCompras +
  //     CServicios.ServicioRecuperarArticulos;


  //   if (!this.usuariosvc.Idempresa) {
  //     this.usuariosvc.Idempresa = 0;
  //   }

  //   const TipoFiltro = slug.split('|')[0];
  //   const Id = this.GetIdFiltro(TipoFiltro, slug);
  //   const IdEmpresa = this.usuariosvc.Idempresa.toString();
  //   this.setIsLoading(true);

  //   return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${TipoFiltro}/${Id}`)
  //     .toPromise()
  //     .then((config: any) => {
  //       const { filters } = config.products;

  //       this.setFilters(filters);

  //       const {products} = config;

  //       products.sort = 'sku';

  //       products.items.sort((a: any, b: any) => {
  //         return a.sku.localeCompare(b.sku);
  //       });

  //       this.setArticulos$(products);
  //       this.setIsLoading(false);

  //     })
  //     .catch((err: any) => {

  //       this.setIsLoading(false);
  //       console.log('RecuperarArticulos Error al consumir servicio:' + err.message);

  //     });
  //   }
  // }

  // setFilters(filters: any[]) {
  //   const uniqueFilters = filters.map(filter => {
  //     if (filter.slug === 'discount') {
  //       const uniqueItems = {};


  //       filter.items.forEach(item => {
  //         if (uniqueItems[item.name]) {
  //           // If the item already exists, add its count
  //           uniqueItems[item.name].count += item.count;
  //         } else {
  //           // Otherwise, add it as a new item
  //           uniqueItems[item.name] = { ...item };
  //         }
  //       });

  //       // Convert the object back to an array of items
  //       filter.items = Object.values(uniqueItems);
  //     }

  //     return filter;
  //   });

  //   this.setFiltersCarro$(uniqueFilters);
  // }


  public async RecuperarArticulosEspeciales(Tipo: string) {
    if (isPlatformBrowser(this.platformId)) {
  
    const urlServicio = 
      this.negocio.configuracion.UrlServicioCarroCompras +
      CServicios.ApiCarroCompras +
      CServicios.ServicioRecuperarEspecialesVendidos;

    if (!this.usuariosvc.Idempresa) {
      this.usuariosvc.Idempresa = 0;
    }

    const IdEmpresa = this.usuariosvc.Idempresa.toString();

    try {
      const response = await firstValueFrom(this.httpClient.get(`${urlServicio}/${Tipo}/${IdEmpresa}`));
      const items = response['items'];


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

    } catch (err) {
     // this.setIsLoading(false);
      console.log('RecuperarArticulosEspeciales Error al consumir servicio:', err.message);
      if (err.error) {
        console.log('Response body:', err.error);
      }
    }
  }
}


  public RecuperarArticulosRelacionados(Idarticulo: number) {
    if (isPlatformBrowser(this.platformId)) {
    this.UrlServicio =
      this.negocio.configuracion.UrlServicioCarroCompras +
      CServicios.ApiCarroCompras +
      CServicios.ServicioRecuperarArticulosRelacionados;

    if (!this.usuariosvc.Idempresa) {
      this.usuariosvc.Idempresa = 0;
    }

    const IdEmpresa = this.usuariosvc.Idempresa.toString();
    const TipoRelacionado = 'DETREL'

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${TipoRelacionado}/${IdEmpresa}/${Idarticulo}`)
      .toPromise()
      .then((art: any) => {

        const { items } = art;

        this.setArticulosRelacionados$(items);

      })
      .catch((err: any) => {

        this.setIsLoading(false);
        console.log('RecuperarArticulosRelacionados Error al consumir servicio:' + err.message);

      });

  }}

  // public RecuperarArticulosBusqueda(Busqueda: string) {
  //   if (isPlatformBrowser(this.platformId)) {
  //   this.UrlServicio =
  //     this.negocio.configuracion.UrlServicioCarroCompras +
  //     CServicios.ApiCarroCompras +
  //     CServicios.ServicioRecuperarArticulosBusqueda;

  //   if (!this.usuariosvc.Idempresa) {
  //     this.usuariosvc.Idempresa = 0;
  //   }

  //   const IdEmpresa = this.usuariosvc.Idempresa.toString();

  //   this.setIsLoading(true);

  //   return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${Busqueda}`)
  //     .toPromise()
  //     .then((art: any) => {

  //       const { items } = art;

  //       this.setArticulosBusqueda$(items);

  //     })
  //     .catch((err: any) => {

  //       this.setIsLoading(false);
  //       console.log('RecuperarArticulosBusqueda Error al consumir servicio:' + err.message);

  //     });

  // }}



  public async RecuperarGetCategoriasPopulares() {
      if (isPlatformBrowser(this.platformId)) {
          this.UrlServicio = 
              this.negocio.configuracion.UrlServicioCarroCompras +
              CServicios.ApiCarroCompras +
              CServicios.ServicioCategoriasPopulares;
  
          if (!this.usuariosvc.Idempresa) {
              this.usuariosvc.Idempresa = 0;
          }
  
          const IdEmpresa = this.usuariosvc.Idempresa.toString();
  
          this.setIsLoading(true);
  
          try {
              const cat: any = await firstValueFrom(this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}`));
              const { categorias } = cat;
  
              this.setCategoriasPopulares$(categorias);
          } catch (err) {
              console.log('RecuperarGetCategoriasPopulares Error al consumir servicio:', err.message);
          } finally {
              this.setIsLoading(false); // Ensure loading is false whether successful or not
          }
      }
  }
  


  public async RecuperarGetMarcasPopulares() {
      this.UrlServicio = 
          this.negocio.configuracion.UrlServicioCarroCompras +
          CServicios.ApiCarroCompras +
          CServicios.ServicioMarcasPopulares;
  
      if (!this.usuariosvc.Idempresa) {
          this.usuariosvc.Idempresa = 0;
      }
  
      const IdEmpresa = this.usuariosvc.Idempresa.toString();
  
      this.setIsLoading(true);
  
      try {
          const marcasPopulares: any = await firstValueFrom(this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}`));
          const { marcas } = marcasPopulares;
          this.setMarcasPopulares$(marcas);
      } catch (err: any) {
          console.log('RecuperarGetMarcasPopulares Error al consumir servicio:', err.message);
      } finally {
          this.setIsLoading(false); // Ensure loading is stopped whether successful or not
      }
  }
  

  public RecuperarArticuloDetalle(Id: number) {

    this.UrlServicio =
      this.negocio.configuracion.UrlServicioCarroCompras +
      CServicios.ApiCarroCompras +
      CServicios.ServicioRecuperarArticulosDetalle;

    if (!this.usuariosvc.Idempresa) {
      this.usuariosvc.Idempresa = 0;
    }

    const IdEmpresa = this.usuariosvc.Idempresa.toString();
    const IdArticulo = Id.toString();

    this.setIsLoading(true);

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${IdArticulo}`)
      .toPromise()
      .then((art: any) => {

        const { articulo, breadcrumbs } = art

        this.seleccionado.item = articulo;
        this.seleccionado.breadcrumbs = breadcrumbs;

        this.setArticuloDetalle$(this.seleccionado);

      })
      .catch((err: any) => {

        this.setIsLoading(false);
        console.log('RecuperarArticuloDetalle Error al consumir servicio:' + err.message);

      });

  }

}
