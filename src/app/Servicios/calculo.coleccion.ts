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

export class CalculosService {


  puntos: number;
  MiImagenCromo: string;
  constructor(
    public https: Http,
    private dbService: DbServiceService

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

  public RegalaCromoAlumnos(cromo: any, alumnoDestinatarioId: number, alumnoQueRegalaId: number, juegoSeleccionado: any) {
    

    // No entiendo muy bien por qué esta petición devuelve un vector de inscripciones y no una sola.
    // por eso indexo la inscripcion con [0]
    // Lo mismo pasa al pedir los cromos del alumno (DameAlbumAlumno)
    this.dbService.DameInscripcionAlumnoJuegoDeColeccion(juegoSeleccionado.id, alumnoDestinatarioId)
    .subscribe( inscripcion => 
                                this.dbService.AsignarCromoAlumno(new Album(inscripcion[0].id, cromo.id))
                                .subscribe()
             );
     this.dbService.DameInscripcionAlumnoJuegoDeColeccion(juegoSeleccionado.id, alumnoQueRegalaId)
    .subscribe( inscripcion => 
                                this.dbService.DameAlbumAlumno(cromo.id, inscripcion[0].id)
                                .subscribe( album => 
                                                    this.dbService.BorrarAlbumAlumno(album[0].id).subscribe()));
  }

  public RegalaCromoEquipos(cromo: any, equipoDestinatarioId: number, equipoQueRegalaId: number, juegoSeleccionado: any) {

    // No entiendo muy bien por qué esta petición devuelve un vector de inscripciones y no una sola.
    // por eso indexo la inscripcion con [0]
    // Lo mismo pasa al pedir los cromos del equipo (DameAlbumEquipo)
    this.dbService.DameInscripcionEquipoJuegoDeColeccion(juegoSeleccionado.id, equipoDestinatarioId)
    .subscribe( inscripcion => 
                            this.dbService.AsignarCromoEquipo(new AlbumEquipo(inscripcion[0].id, cromo.id))
                            .subscribe()
              );
    this.dbService.DameInscripcionEquipoJuegoDeColeccion(juegoSeleccionado.id, equipoQueRegalaId)
    .subscribe( inscripcion => 
                                this.dbService.DameAlbumEquipo(cromo.id, inscripcion[0].id)
                                .subscribe( album => 
                                                    this.dbService.BorrarAlbumEquipo(album[0].id)
                                                    .subscribe()));
  }

  public RegalaCromoAlumnoEquipo(cromo: any, alumnoDestinatarioId: number, alumnoQueRegalaId: number, juegoSeleccionado: any) {
    // Es un juego en equipo pero asignación individual. Por tanto hay que quitar el cromo de los albunes de los equipos
    this.DameEquipoAlumnoEnJuegoDeColeccion (alumnoDestinatarioId, juegoSeleccionado.id)
    .subscribe ( equipoDestinatorio => {
      this.DameEquipoAlumnoEnJuegoDeColeccion (alumnoQueRegalaId, juegoSeleccionado.id)
      .subscribe ( equipoDeAlumnoQueRegala => {
        this.RegalaCromoEquipos (cromo, equipoDestinatorio.id, equipoDeAlumnoQueRegala.id, juegoSeleccionado);
      });
    });
  }
  public DameEquipoAlumnoEnJuegoDeColeccion(alumnoId: any, juegoId: any): any {
    const equipoObservable = new Observable(obs => {
      console.log ('HOLAAAAAAAAAAAAAAAavoy a por el equipo de este alumno en el juego');
      console.log ('Parametros de entrada: alumnoId:',alumnoId,'juegoId:',juegoId);

      // primero traigo los equipos que participan en el juego
     
      this.dbService.DameEquiposJuegoDeColeccion (juegoId)
      .subscribe (equiposJuego => {
                                    console.log ('equipos del juego',equiposJuego);
                                    
                                    console.log("FALLO1");
                                   

                                    // ahora traigo los equipos a los que pertenece el alumno
                                    this.dbService.DameEquiposDelAlumno (alumnoId)
                                    .subscribe (equiposAlumno => {
                                                                  console.log("FALLO2")
                                                                  console.log ('equipos del alumno:',equiposAlumno);
                                                                  // ahora miro cual es el equipo que está en ambas listas
                                                                  const equipo = equiposAlumno.filter(e => equiposJuego.some(a => a.id === e.id))[0];
                                                                  console.log ('interseccion');
                                                                  console.log (equipo);
                                                                  obs.next (equipo);
                                                                  });

                                  });

    });
    return equipoObservable;
  }
 


}