import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private UrlServicio: string;
  private megaMenu$ = new Subject<NavigationLink[]>();
  private Articulos$ = new Subject<ArticulosCarroComprasResponse>();
  private Articulos: ArticulosCarroComprasResponse;
  private IdempresaCLienteLogueada: number;

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

    return this.httpClient.get(`${this.UrlServicio}/${IdEmpresa}/${TipoFiltro}/${Id}`, { responseType: 'text' })
        .toPromise()
        .then((config: any) => {

          this.setArticulos$(JSON.parse(config));
          console.log(this.Articulos);

        })
        .catch((err: any) => {

          console.log ('Error al consumir servicio:' + err.message);

        });

  }


}
