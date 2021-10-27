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
  private APIUrlProfesoresHost =this.base+'/api/Profesores';
  private APIUrlRecursoJuego =this.base+'/api/JuegosDeCuento';
  private APIUrlRecursoJuegoColeccion =this.base+'/api/JuegosDeColeccion';
  private APIUrlEscena=this.base+'/api/Cuentos';
  private APIUrlElemento=this.base+'/api/Escenas'
  private APIurlImagenesLibrosHost =this.base+'/api/imagenes';
  private APIurlAlumnoJuego = this.base+'/api/AlumnosJuegoDeCuento';
  private APIurlAlumnoJuegoColeccion=this.base+'/api/AlumnosJuegoDeColeccion';
  private APIurlCuento = this.base+'/api/Cuentos';
  private APIurlAlumnos= this.base+'/api/Alumnos';
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
public dameAlumnosJuegoDeColeccion(idalumno): Observable<any> 
{
  console.log('Juegos de Coleccion del Alumno: ',this.APIurlAlumnoJuegoColeccion+ '?filter[where][alumnoId]=' + idalumno);
  return this.http.get<any[]>(this.APIurlAlumnoJuegoColeccion+ '?filter[where][alumnoId]=' + idalumno);

}
public dameAlumnosJuegoDeColeccionxjuegocoleid(idalumno,id): Observable<any> 
{
 return this.http.get<any[]>(this.APIurlAlumnoJuegoColeccion+ '?filter[where][alumnoId]=' + idalumno +'&filter[where][juegoDeColeccionId]='+id);
}

public dameAlumnosJuegoDeCuentoxjuegocoleid(idalumno,id): Observable<any> 
{
  console.log("Ir Juego Cuento",this.APIurlAlumnoJuego+ '?filter[where][alumnoID]=' + idalumno +'&filter[where][juegoId]='+id);
  return this.http.get<any[]>(this.APIurlAlumnoJuego+ '?filter[where][alumnoID]=' + idalumno +'&filter[where][juegoId]='+id);
}

  //EJEMPLO:http://localhost:3000/api/AlumnosJuegoDeColeccion?filter[where][alumnoId]=136&filter[where][juegoDeColeccionId]=140


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
