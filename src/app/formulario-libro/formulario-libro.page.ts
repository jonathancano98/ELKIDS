import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{DbServiceService} from 'src/app/db-service.service'
import { NgForm } from '@angular/forms';
import{Libro} from '../home/clases/libro';
import{Alumno} from '../home/clases/alumno';
import { AlertController, NavController } from '@ionic/angular';
import { Alumnojuegodecuento } from '../home/clases/Alumnojuegodecuento';

@Component({
  selector: 'app-formulario-libro',
  templateUrl: './formulario-libro.page.html',
  styleUrls: ['./formulario-libro.page.scss'],
})
export class FormularioLibroPage implements OnInit {

    libro;
    alumno: Alumno;
    idAlumnoJuego;



  constructor(public navCtrl: NavController, private router: Router, private dBservice: DbServiceService , public alertController: AlertController) { }

  ngOnInit() {
    console.log("Entramos a formulario");
    this.Damealumno();
  }

  Damealumno() {
    this.idAlumnoJuego=localStorage.getItem("idAlumnoJuego");
    console.log(this.idAlumnoJuego);

    this.dBservice.dameAlumnoJuego(this.idAlumnoJuego)
      .subscribe(res => {
        
        this.alumno = res;
        console.log("Recibo alumno");
        console.log(this.alumno);
        

      });

  }



  public Atras() {

    //this.router.navigate(['/inicio']);
    this.navCtrl.navigateRoot(['/inicio']);
    

  }


  public crearlibro(form: NgForm) {

    this.libro = new Libro;
    
      if (form.value.titulo != null) {
        this.libro.titulo = form.value.titulo;
        console.log("perf");
        console.log(this.libro.titulo);
      }
      if (form.value.textarea != null) {
        this.libro.resumen = form.value.textarea;
        console.log(this.libro.resumen);
      }
      this.libro.autor = this.alumno.Nombre;
      this.libro.portada = 'aa';
      this.libro.idAlumno = this.alumno.id;
      this.libro.numeropag = '32';
  

      
      this.dBservice.comprobarTituloLibro(this.libro.titulo)
        .subscribe(res => {
          if(res[0] == null){
          this.publicarLibro();
          }
          else{
            this.alertaNombreIgual();
          }
        });
  
  
    }

    public publicarLibro()
    {
      this.idAlumnoJuego=localStorage.getItem("idAlumnoJuego")
  
      this.dBservice.publicarlibro(this.idAlumnoJuego, this.libro)
        .subscribe(res => {
          console.log(res);
         // this.crearCarpeta(res.id);
         

        });

        this.router.navigate(['/inicio']);
    }

    async alertaNombreIgual() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'No se ha creado el cuento',
        subHeader: 'El nombre ya está ocupado',
        message: 'Ya existe un libro con este nombre, elije otro',
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }






}
