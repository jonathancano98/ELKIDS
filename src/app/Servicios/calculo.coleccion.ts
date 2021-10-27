import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, ResponseContentType } from '@angular/http';
// tslint:disable-next-line:max-line-length

import { Observable, observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { stringify } from 'querystring';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  
  puntos: number;
  MiImagenCromo: string;
  constructor(
    public https: Http
  ) {
  }

// Esta función recibe una lista de cromos en la que puede haber repetidos
  // y geneera otra en la que cada cromo aparece una sola vez y se le asocia el número
  // de veces que aparece reperido en la lista de entrada
  GeneraListaSinRepetidos(listaCromos: any[]): any[] {
    const listaCromosSinRepetidos: any[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaCromos.length; i++) {
      const n = listaCromos.filter(cromo => cromo.Nombre === listaCromos[i].Nombre).length;
      if (listaCromosSinRepetidos.filter(res => res.cromo.Nombre === listaCromos[i].Nombre).length === 0) {
        listaCromosSinRepetidos.push({ rep: n, cromo: listaCromos[i] });
      }
    }
    return listaCromosSinRepetidos;
  }

  DameCromosQueNoTengo(MisCromos: any[], TodosLosCromos: any[]): any[] {
    const CromosQueNoTengo: any[] = [];
    // tslint:disable-next-line:no-shadowed-variable
    let Cromo: any;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < TodosLosCromos.length; i++) {
      Cromo = MisCromos.filter(res => res.id === TodosLosCromos[i].id)[0];
      if (Cromo === undefined) {
        CromosQueNoTengo.push({ rep: 0, cromo: TodosLosCromos[i] });
      }
    }
    return CromosQueNoTengo;
  }
}