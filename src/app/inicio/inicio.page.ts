import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Alumnojuegodecuento } from '../home/clases/Alumnojuegodecuento';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  alumnoJuegoDeLibro: any;
  nivel1;
  nivel2;
  nivel3;
  listaDeLibrosAlumnoJuego: any[] = [];
  seleccionado: boolean[];


  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
    
   this.obtenemosAlumnoJuegoLibro();

    this.obtenemosLosLibrosAlumnoJuego();

   
  }

  //Forzamos el alumno con id 17 ya que sabemos que tiene un juego y ahora mismo no esta implementado el login
  obtenemosAlumnoJuegoLibro()
  {
    this.dBservice.dameAlumnoJuegoLibro(18)
    .subscribe(res => {
      console.log(res);
      this.alumnoJuegoDeLibro=res;
      console.log(res.Nombre);
      console.log(res.id);
      console.log(res.juegoId);
      localStorage.setItem("idAlumnoJuego", res.id);
      localStorage.setItem("idJuego",res.juegoId)

    });

    
  }

  obtenemosLosLibrosAlumnoJuego()
  {
    this.dBservice.dameLibrosAlumnoJuego(18).subscribe(res => {
      
     // this.crearCarpeta(res.id);
      this.listaDeLibrosAlumnoJuego = res;
      console.log("yA HA LLEGADO");
      console.log(this.listaDeLibrosAlumnoJuego);
      this.seleccionado = Array(this.listaDeLibrosAlumnoJuego.length).fill(false);
      
    });

  }
  irCuento(){
    let count: boolean;
    count = false;
  
    console.log(this.seleccionado);

      for(var i = 0; i < this.seleccionado.length; i++)
      {
        if(this.seleccionado[i])
        {
          localStorage.setItem("idLibroDelAlumno",this.listaDeLibrosAlumnoJuego[i].id);
          localStorage.setItem("contenedor",this.listaDeLibrosAlumnoJuego[i].titulo);
          count = true;
          //this.router.navigate(['/menu-libro']);

        }


      }

      if(count) this.router.navigate(['/menu-libro']);

  }


  //Esta funcion nos lleva al html de formulario-libro
  public crearCuento() {

    this.router.navigate(['/formulario-libro']);

  }
  



}
