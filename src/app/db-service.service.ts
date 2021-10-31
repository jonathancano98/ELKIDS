import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RecursoLibro} from '../app/home/clases/recursoLibro';
import{RecursoLibroJuego} from'../app/home/clases/recursoLibroJuego';
import { ResponseContentType, Http} from '@angular/http';
import {Alumnojuegodecuento} from '../app/home/clases/Alumnojuegodecuento';
import{Libro} from '../app/home/clases/libro';
import{imagenEscena}from '../app/home/clases/imagenEscena';
import{juegolibro}from '../app/home/clases/juegolibro';
import { Alumno } from './home/clases/alumno';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  //private base='http://192.168.1.65:3000';
  private base='http://localhost:3000';


  private APIUrlhost = 'http://localhost:3000/api/Profesores/8/recursosLibros';

  private APIUrlGrupos = this.base + '/api/Grupos';
  private APIUrlProfesoresHost =this.base+'/api/Profesores';
  private APIUrlRecursoJuego =this.base+'/api/JuegosDeCuento';
  private APIUrlRecursoJuegoColeccion =this.base+'/api/JuegosDeColeccion';
  private APIUrlEscena=this.base+'/api/Cuentos';
  private APIUrlElemento=this.base+'/api/Escenas'
  private APIurlImagenesLibrosHost =this.base+'/api/imagenes';
  private APIurlAlumnoJuego = this.base+'/api/AlumnosJuegoDeCuento';
  private APIurlAlumnoJuegoColeccion=this.base+'/api/AlumnosJuegoDeColeccion';
  private APIurlCuento = this.base+'/api/Cuentos';
  private APIRUrlColecciones = this.base + '/api/Colecciones';
  private APIurlAlumnos= this.base+'/api/Alumnos';
  private APIRUrlAlbum = this.base + '/api/Albumes';
  private APIUrlEquipoJuegoDeColeccion = this.base + '/api/EquiposJuegoDeColeccion';
  private APIRUrlAlbumEquipo = this.base + '/api/albumsEquipo';



  
  //private APIurlJuegos= this.base +'/api/juegodelibro';
 
  
  private APIUrl = 'http://147.83.249.79:3000/api/Profesores/8/recursosLibros';
  private APIUrlProfesores='http://147.83.249.79:3000/api/Profesores';
  private APIurlImagenesLibros='http://147.83.249.79:3000/api/imagenes';
  constructor(private http: HttpClient,private httpImagenes: Http ) {}

  dameAlumno (nombre: string): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/' + nombre);
  }

  public loginAlumno(username: string, password: string): Observable<any> {
    console.log('Entro a mostrar a ' + username + ' ' + password);
    return this.http.get<any>(this.APIurlAlumnos + '?filter[where][Username]=' + username + '&filter[where][Password]=' + password);
  }

  dameAlumnoPorId (id): Observable<any> {
    return this.http.get<any>(this.APIurlAlumnos + '/' + id);
  }

  dameGruposDeAlumno(id):Observable<any[]>{
    
    return this.http.get<any[]>(this.APIurlAlumnos+ '/'+id+'/grupos')

  }

  public DameAlumnosJuegoCuento(id): Observable<any>  {
    return this.http.get<Alumnojuegodecuento>(this.APIUrlRecursoJuego + '/' + id + '/AlumnosJuegoDeCuento');
  
   }

   public ModificaAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(this.APIurlAlumnos+ '/' + alumno.id, alumno);
  }




    recuperarListaRecursos(profesorId): Observable<RecursoLibro[]> {
      return this.http.get<RecursoLibro[]>(this.APIUrlProfesoresHost  + '/' + profesorId + '/recursosCuentos');
    }



    recuperarListaRecursosJuego(juegoId):Observable<RecursoLibroJuego[]>{
      return this.http.get<RecursoLibroJuego[]>(this.APIUrlRecursoJuego  + '/' + juegoId +'/RecursosJuegoDeCuentos');

    }

    obtenerImagenesEscena(nombreCuento):Observable<imagenEscena[]>{
      return this.http.get<imagenEscena[]>(this.APIurlImagenesLibrosHost  + '/' + nombreCuento +'/files');

    }


    public crearCarpeta (name: any): Observable<any> {
      return this.http.post<any>(this.APIurlImagenesLibrosHost, name);
  
    }

    public postEscena(libroId, escenas: any): Observable<any> {
      return this.http.post<any>(this.APIUrlEscena + '/' + libroId + '/Escenas', escenas);

      //http://localhost:3000/api/libro/21/escenas
      //return this.http.post<Libro>(this.APIurlAlumnoJuego + '/' + idalumno + '/Libro', libro);
  
    }

    public postElemento(escenaId, elementos: any): Observable<any> {
      return this.http.post<any>(this.APIUrlElemento + '/' + escenaId + '/Elementos', elementos);

      //http://localhost:3000/api/libro/21/escenas
      //return this.http.post<Libro>(this.APIurlAlumnoJuego + '/' + idalumno + '/Libro', libro);
  
    }



    /**
     * 
     * @param containerName 
     * @param fileName 
     * @returns 
     */
    public getImagenesRecurso(containerName, fileName): Observable<any> {
      return this.httpImagenes.get(this.APIurlImagenesLibrosHost  + '/' + containerName + '/download/' + fileName, { responseType: ResponseContentType.Blob });
    }

    public getEscenasDeRecurso(containerName, fileName): Observable<any> {
      return this.httpImagenes.get(this.APIurlImagenesLibrosHost  + '/' + containerName + '/download/' + fileName, { responseType: ResponseContentType.Blob });
    }
    /**
     * @brief 
     * @param id 
     * @returns 
     */
    public dameAlumnoJuegoCuento(id): Observable<any>  {

      console.log("Dame Alumno Juego Cuento URL: ",this.APIurlAlumnoJuego+ '/' + id);
      return this.http.get<Alumnojuegodecuento>(this.APIurlAlumnoJuego+ '/' + id);
      
     }
   
     ////////////////////////////////////////////////////////////////////////AÑADIDO
     public dameAlumnoJuegoColeccion(id): Observable<any>  {

      console.log("Dame Alumno Juego Coleccion URL: ",this.APIurlAlumnoJuegoColeccion+ '/' + id);
      return this.http.get<any>(this.APIurlAlumnoJuegoColeccion+ '/' + id);
      
     }
     ////////////////////////////////////////////////////////////////////////AÑADIDO

     public dameAlumnoJuego(id): Observable<any> {
      return this.http.get<any>(this.APIurlAlumnoJuego+ '/' + id);
    }

    public postImage(contenedor: string, formData: FormData): Observable<any> {
      return this.http.post<any>(this.APIurlImagenesLibrosHost + '/' + contenedor + '/upload', formData);
  
    }

    public BorraImagenEscena (contenedor, file):Observable<any>{
      return this.http.delete<any>(this.APIurlImagenesLibrosHost + '/' + contenedor + '/files/' + file) ;
    }

    public BorrarElementosDeEscena(escenaId):Observable<any> {

      return this.http.delete<any>(this.APIUrlElemento + '/' + escenaId + '/Elementos') ;

    }





    public BorrarEscena(escenaId):Observable<any>{

      return this.http.delete<any>(this.APIUrlElemento + '/' + escenaId) ;
    }


    public getElemento(escenaId, frames: any): Observable<any> {
      return this.http.get<any>(this.APIUrlElemento + '/' + escenaId + '/Elementos');
  
    }

     public comprobarTituloCuento(nombre: string){
      return this.http.get<any>(this.APIurlCuento + '?filter[where][titulo]=' + nombre);
    
    }
    public publicarCuento(idalumno: string, libro: Libro): Observable<Libro> {
      return this.http.post<Libro>(this.APIurlAlumnoJuego + '/' + idalumno + '/Cuento', libro);
    }

    public dameCuento(idJuegoAlumnoLibro): Observable<any> {
      return this.http.get<any>(this.APIurlAlumnoJuego + '/' + idJuegoAlumnoLibro + '/Cuento');
  
    }
    //arreglar esta funcion, conseguir que me pase esa lista
    public dameCuentosAlumnoJuego(idalumno): Observable<any> 
    {
      return this.http.get<any[]>(this.APIurlCuento+ '?filter[where][idAlumno]=' + idalumno);

    }
    

    public dameAlumnosJuegoDeCuento(idalumno): Observable<any> 
    {
      return this.http.get<any[]>(this.APIurlAlumnoJuego+ '?filter[where][alumnoID]=' + idalumno);

    }


//////////////////////////////////////////////////////////////////AÑADIDO

public GruposJuegoColecciondealumno(idgrupo:any,alumnonombre:any): Observable<any[]>
{
  console.log(" GruposJuegoColecciondealumno: ",this.APIUrlGrupos+'/'+idgrupo+'/alumnos?filter[where][Nombre]='+alumnonombre);
  return this.http.get<any[]>(this.APIUrlGrupos+'/'+idgrupo+'/alumnos?filter[where][Nombre]='+alumnonombre);
}

public dameJuegosdeColeccionEquipoActivos(): Observable<any>
{
  console.log("Url Datos Juegos de Colecciones Equipos:",this.APIUrlRecursoJuegoColeccion+'?filter[where][Modo]=Equipos&filter[where][JuegoActivo]=true');
  return this.http.get<any[]>(this.APIUrlRecursoJuegoColeccion+'?filter[where][Modo]=Equipos&filter[where][JuegoActivo]=true');
}
public dameAlumnosJuegoDeColeccion(idalumno): Observable<any> 
{
  console.log('Juegos de Coleccion del Alumno: ',this.APIurlAlumnoJuegoColeccion+ '?filter[where][alumnoId]=' + idalumno);
  return this.http.get<any[]>(this.APIurlAlumnoJuegoColeccion+ '?filter[where][alumnoId]=' + idalumno);

}
public dameAlumnosJuegoDeColeccionxjuegocoleid(idalumno,id): Observable<any> 
{
  console.log("Alumnos:",this.APIurlAlumnoJuegoColeccion+ '?filter[where][alumnoId]=' + idalumno +'&filter[where][juegoDeColeccionId]='+id);
 return this.http.get<any[]>(this.APIurlAlumnoJuegoColeccion+ '?filter[where][alumnoId]=' + idalumno +'&filter[where][juegoDeColeccionId]='+id);
}

public dameAlumnosJuegoDeCuentoxjuegocoleid(idalumno,id): Observable<any> 
{
  console.log("Ir Juego Cuento",this.APIurlAlumnoJuego+ '?filter[where][alumnoID]=' + idalumno +'&filter[where][juegoId]='+id);
  return this.http.get<any[]>(this.APIurlAlumnoJuego+ '?filter[where][alumnoID]=' + idalumno +'&filter[where][juegoId]='+id);
}

  //EJEMPLO:http://localhost:3000/api/AlumnosJuegoDeColeccion?filter[where][alumnoId]=136&filter[where][juegoDeColeccionId]=140

public dameAlumnoporidalumno(idalumno): Observable<any>
{
  console.log('URL Datos Alumno:',this.APIurlAlumnos+ '?filter[where][id]='+ idalumno);
  return this.http.get<any>(this.APIurlAlumnos+ '?filter[where][id]='+ idalumno);

}
public dameJuegoporidjuego(idjuego): Observable<any>
{
  console.log('URL Datos Alumno:',this.APIUrlRecursoJuegoColeccion+ '?filter[where][id]='+ idjuego);
  return this.http.get<any>(this.APIUrlRecursoJuegoColeccion+ '?filter[where][id]='+ idjuego);

}

public DameColeccionPromise(coleccionId: number): Promise<any> {
  return this.http.get<any>(this.APIRUrlColecciones + '/' + coleccionId).toPromise();
}

public DameInscripcionAlumnoJuegoDeColeccion(juegoDeColeccionId: number, alumnoId: number): Observable<any> {
  console.log("URL DameInscripcionAlumnoJuegoColeccion: ",this.APIurlAlumnoJuegoColeccion + '?filter[where][juegoDeColeccionId]='
  + juegoDeColeccionId + '&filter[where][alumnoId]=' + alumnoId);
  return this.http.get<any>(this.APIurlAlumnoJuegoColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId + '&filter[where][alumnoId]=' + alumnoId);
}

public DameCromosAlumno(alumnoJuegoDeColeccionId: number): Observable<any[]> {

  console.log("Dame cromos ALumno:",this.APIurlAlumnoJuegoColeccion + '/' + alumnoJuegoDeColeccionId + '/cromos');
  return this.http.get<any[]>(this.APIurlAlumnoJuegoColeccion + '/' + alumnoJuegoDeColeccionId + '/cromos');
}
public DameCromosColeccion(coleccionId: number): Observable<any[]> {
  return this.http.get<any[]>(this.APIRUrlColecciones + '/' + coleccionId + '/cromos');
}

public DameAlumnosJuegoDeColeccion(juegoDeColeccionId: number): Observable<any[]> {
  console.log('Voy a por los alumnoooooos',this.APIUrlRecursoJuegoColeccion + '/' + juegoDeColeccionId + '/alumnos');
  return this.http.get<any[]>(this.APIUrlRecursoJuegoColeccion + '/' + juegoDeColeccionId + '/alumnos');
}

// DEVUELVE LOS EQUIPOS QUE FORMAN PARTE DE UN JUEGO DE COLECCIÓN DETERMINADO
public DameEquiposJuegoDeColeccion(juegoDeColeccionId: number): Observable<any[]> {
  return this.http.get<any[]>(this.APIUrlRecursoJuegoColeccion + '/' + juegoDeColeccionId + '/equipos');
}

 // NOS DEVUELVE LOS ALUMNOS DEL GRUPO CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
 public DameAlumnosGrupo(grupoId: number): Observable<any[]> {
   console.log(" ALUMNOS DEL GRUPO:",this.APIUrlGrupos + '/' + grupoId + '/alumnos');
  return this.http.get<any[]>(this.APIUrlGrupos + '/' + grupoId + '/alumnos');
}
// ASIGNAMOS UN NUEVO CROMO PARA EL ÁLBUM DEL ALUMNO
public AsignarCromoAlumno(album: any) {
  return this.http.post<any>(this.APIRUrlAlbum, album);
}
public DameAlbumAlumno(cromoId: number, alumnoJuegoDeColeccionId: number): Observable<any> {
  // tslint:disable-next-line:max-line-length
  return this.http.get<any>(this.APIRUrlAlbum + '?filter[where][cromoId]=' + cromoId + '&filter[where][alumnoJuegoDeColeccionId]=' + alumnoJuegoDeColeccionId);
}
public BorrarAlbumAlumno(AlbumId: number) {
  return this.http.delete<any>(this.APIRUrlAlbum + '/' + AlbumId);
}

  // DEVUELVE UN ARRAY CON LAS INCRIPCIONES DE LOS EQUIPOS A UN JUEGO DE COLECCIÓN DETERMINADO
  public DameInscripcionEquipoJuegoDeColeccion(juegoDeColeccionId: number, equipoId: number): Observable<any> {
    console.log("URL INCRIPCIONES DE LOS EQUIPOS JUEGO DE COLECCIÓN",this.APIUrlEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId + '&filter[where][equipoId]=' + equipoId);
    return this.http.get<any>(this.APIUrlEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
      + juegoDeColeccionId + '&filter[where][equipoId]=' + equipoId);
  }
 // ASIGNAMOS UN NUEVO CROMO PARA EL ÁLBUM DEL EQUIPO
 public AsignarCromoEquipo(album: any) {
  return this.http.post<any>(this.APIRUrlAlbumEquipo, album);
}
// Lo mismo para equipos
public DameAlbumEquipo(cromoId: number, equipoJuegoDeColeccionId: number): Observable<any> {
  // tslint:disable-next-line:max-line-length
  return this.http.get<any>(this.APIRUrlAlbumEquipo + '?filter[where][cromoId]=' + cromoId + '&filter[where][equipoJuegoDeColeccionId]=' + equipoJuegoDeColeccionId);
}
public BorrarAlbumEquipo(AlbumEquipoId: number) {
  return this.http.delete<any>(this.APIRUrlAlbumEquipo + '/' + AlbumEquipoId);
}
// Devuelve los equipos a los que pertenece un alumno
public DameEquiposDelAlumno(alumnoId: any): Observable<any[]> {
  console.log(" equipos a los que pertenece un alumno",this.APIurlAlumnos + '/' + alumnoId + '/equipos');
  return this.http.get<any[]>(this.APIurlAlumnos + '/' + alumnoId + '/equipos');
}
 // NOS DEVUELVE LOS CROMOS QUE TIENE UN EQUIPO CONCRETO EN UN JUEGO DE COLECCIÓN CONCRETO
 public DameCromosEquipo(equipoJuegoDeColeccionId: number): Observable<any[]> {
  return this.http.get<any[]>(this.APIUrlEquipoJuegoDeColeccion + '/' + equipoJuegoDeColeccionId + '/cromos');
}

//////////////////////////////////////////////////////////////////AÑADIDO



///////////////////////////////////////////////////////////////////////////ARREGLAADO

public dameJuegosDelAlumno(idJuegos): Observable<any>
{
  console.log('Juegos del Alumno:',this.APIUrlRecursoJuego+ '/'+ idJuegos);
  return this.http.get<any>(this.APIUrlRecursoJuego+ '/'+ idJuegos);

}

 public dameJuegosColeccionDelAlumno(idJuegos): Observable<any>
 {
   console.log('Informacion del Juego de Coleccion del Alumno:',this.APIUrlRecursoJuegoColeccion+ '/'+ idJuegos);
   return this.http.get<any>(this.APIUrlRecursoJuegoColeccion+ '/'+ idJuegos);

 }
// public dameJuegosDelAlumno(idJuegos): Observable<juegolibro>
// {
//   console.log('Juegos del Alumno:',this.APIUrlRecursoJuego+ '/'+ idJuegos);
//   return this.http.get<juegolibro>(this.APIUrlRecursoJuego+ '/'+ idJuegos);

// }

///////////////////////////////////////////////////////////////////////////ARREGLAADO


   
}
