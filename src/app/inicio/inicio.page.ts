import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service';
import { AlertController, NavController } from '@ionic/angular';
import { Alumnojuegodecuento } from '../home/clases/Alumnojuegodecuento';
import { Router } from '@angular/router';
import { LifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';


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
  cuentoCreado: boolean;


  constructor(
    private router: Router,
    private dBservice: DbServiceService ,
    public alertController: AlertController
  )
  { }

  ngOnInit() {
    
   //this.obtenemosAlumnoJuegoLibro();

    //this.obtenemosLosLibrosAlumnoJuego();

   
  }


  ionViewWillEnter() {
    this.obtenemosAlumnoJuegoLibro();
    this.obtenemosLosLibrosAlumnoJuego();
    console.log('ionViewWillEnter les goooooo');
 }

  //Forzamos el alumno con id 17 ya que sabemos que tiene un juego y ahora mismo no esta implementado el login
  obtenemosAlumnoJuegoLibro()
  {
    this.dBservice.dameAlumnoJuegoLibro(localStorage.getItem("idAlumnoJuego"))
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
    this.cuentoCreado=false;
    this.dBservice.dameLibrosAlumnoJuego(localStorage.getItem("idAlumnoJuego")).subscribe(res => {
      
     // this.crearCarpeta(res.id);
     if(res.length>0) this.cuentoCreado=true;
      this.listaDeLibrosAlumnoJuego = res
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

      if(count) {
        localStorage.setItem("espiando","false");
        this.router.navigate(['/menu-libro']);

      }

  }

  irEspiarCuentos(){
    console.log(this.alumnoJuegoDeLibro.permisoparaver)
    if(this.alumnoJuegoDeLibro.permisoparaver)
    this.router.navigate(['/cuentos-a-espiar']);
    else this.alertaNoTienesPermisoParaEspiar();
    
  }

  irMisJuegos()
  {
    this.router.navigate(['/mis-juegos']);
  }


  //Esta funcion nos lleva al html de formulario-libro
  public crearCuento() {

    if(this.cuentoCreado) this.alertaCuentoYaCreado();    
    else this.router.navigate(['/formulario-libro']);

  }

  async alertaNoTienesPermisoParaEspiar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No tienes permiso para espiar!!',
      //subHeader: 'El nombre ya está ocupado',
      message: 'Necesitas el permiso para poder espiar',
      buttons: ['Aceptar']
    });

    await alert.present();
  }
  async alertaCuentoYaCreado() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cuento ya creado!!',
      //subHeader: 'El nombre ya está ocupado',
      message: 'Solo puedes crear un cuento por juego',
      buttons: ['Aceptar']
    });

    await alert.present();
  }
  



}
