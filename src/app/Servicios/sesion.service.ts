
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, ResponseContentType } from '@angular/http';
// tslint:disable-next-line:max-line-length

import { Observable, observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { stringify } from 'querystring';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { DbServiceService } from '../db-service.service';
import { element } from 'protractor';
import { Album } from '../home/clases/Album';
import { AlbumEquipo } from '../home/clases/Albumequipo';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  

    coleccion: any;
    cromos:any;

    constructor() { }

    public TomaColeccion(coleccion: any) {
        this.coleccion = coleccion;
      }
      
    
      public TomaCromos(cromosColeccion: any[]) {
        this.cromos = cromosColeccion;
      }

      public DameCromos(): any[] {
        return this.cromos;
      }

      public DameColeccion(): any {
        return this.coleccion;
      }
    

}