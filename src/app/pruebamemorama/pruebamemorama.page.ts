import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service';
import * as URL from '../URLS/urls';


@Component({
  selector: 'app-pruebamemorama',
  templateUrl: './pruebamemorama.page.html',
  styleUrls: ['./pruebamemorama.page.scss'],
})
export class PruebamemoramaPage implements OnInit {

  constructor(private dbService:DbServiceService,) { }

  iconos;
  Cartaspartedetras: any[]=[];
  selecciones: any[]=[];
  juegoDeMemoramaId;
  familiaId;
  damecartasdelafamilia: any[]=[];
  damecartasdelafamilia2: any[]=[];
  preparado=false;
  tarjetasayuda:any[]=[];
contadorpos=0;
contadorneg=0;
  ngOnInit() {

    console.log("ionViewWillEnter");


    // RECOJO LAS VARIABLES juegoDeMemoramaId y la familiaId
    this.juegoDeMemoramaId=localStorage.getItem("juegoDeMemoramaId");
    this.familiaId = localStorage.getItem("familiaId");

    console.log("juegoDeMemoramaId:", this.juegoDeMemoramaId,"familiaId:",this.familiaId);

 
    // Pido las cartas del Alumno
    this.DameLasCartasDelAlumno();



  }

  
  DameLasCartasDelAlumno() {

    this.dbService.Damecartasdelafamilia(this.familiaId)
    .subscribe(Cartas =>{
                        for(let i=0;Cartas.length>i;i++)
                        {
                          this.damecartasdelafamilia.push(Cartas[i]);
                          this.damecartasdelafamilia.push(Cartas[i]);
  
  
  
                        }
  
                        // this.damecartasdelafamilia2=this.damecartasdelafamilia;
                        
                         console.log("damecartasdelafamilia",this.damecartasdelafamilia);
                          this.MezclarArray();
                          this.PreparaImagenesCartasQueTengo();
                          this.preparado = true;
  
  
                         
    })
  
  }
  
  MezclarArray(){
  
    this.damecartasdelafamilia.sort(function(){return Math.random()-0.5});
  
  
  }
  
  PreparaImagenesCartasQueTengo() {
  
    for (let i = 0; i < this.damecartasdelafamilia.length; i++) {
      
      const elem = this.damecartasdelafamilia[i];
      
      //LOS METO EN ESTE ARRAY PORQUE EN ELEM ESTA LA INFO DE CADA CARTA
      this.damecartasdelafamilia2.push(elem);
  
      //PARTE DE ADELANTE
      this.damecartasdelafamilia[i] = URL.ImagenesCartas + elem.imagenDelante;
      //console.log("cartasQueTengoImagenDelante[i]:",this.damecartasdelafamilia[i]);
      // console.log("damecartasdelafamilia2",this.damecartasdelafamilia2);
  
      //PARTE DE ATRAS
      this.Cartaspartedetras[i]=URL.ImagenesCartasdetras + elem.imagenDetras;
      // this.cromosQueTengoImagenDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;
      
    }
    
  }
  

Ayuda(){
  let tarjeta0 = document.getElementById("tarjeta"+0);
  let tarjeta3 = document.getElementById("tarjeta"+3);
  let tarjeta6 = document.getElementById("tarjeta"+6);
  let tarjeta9 = document.getElementById("tarjeta"+9);

  this.tarjetasayuda.push(tarjeta0,tarjeta3,tarjeta6,tarjeta9);

for(let i=0; this.tarjetasayuda.length > i;i++){


 if(this.tarjetasayuda[i].style.transform === "rotateY(180deg)"){

  console.log("Ya esta girada nen");

 } 
 else{ 


  
  this.tarjetasayuda[i].style.transform = "rotateY(180deg)";    
  
  setTimeout(() => {
   
    this.tarjetasayuda[i].style.transform = "rotateY(0deg)";    

   
  }, 2000);

}
}

}

  seleccionartarjeta(i:number){

    let tarjeta = document.getElementById("tarjeta"+i);
    console.log(tarjeta,i);
    if(tarjeta.style.transform != "rotateY(180deg)"){
      tarjeta.style.transform = "rotateY(180deg)";
      this.selecciones.push(i);
    }
    if(this.selecciones.length == 2){
      this.deseleccionar(this.selecciones);
      this.selecciones=[];
    }


  }

  deseleccionar(seleccionesrecibidas:any[]){

    let contadorpositivo = document.getElementById("item3");
    console.log(contadorpositivo);
    let contadornegativo = document.getElementById("item4");

    setTimeout(() => {
    
      let trasera1=document.getElementById("trasera"+seleccionesrecibidas[0]);
      let trasera2=document.getElementById("trasera"+seleccionesrecibidas[1]);

      console.log("TRASERA1",trasera1,"TRASERA2",trasera2);
      console.log("TRASERA1 HTML",trasera1.innerHTML,"TRASERA2 HTML",trasera2.innerHTML);

      if(trasera1.innerHTML != trasera2.innerHTML){
        let tarjeta1=document.getElementById("tarjeta"+seleccionesrecibidas[0]);
        let tarjeta2=document.getElementById("tarjeta"+seleccionesrecibidas[1]);
        tarjeta1.style.transform = "rotateY(0deg)";
        tarjeta2.style.transform = "rotateY(0deg)";
        
        this.contadorneg++;
        contadornegativo.innerHTML=this.contadorneg+"";
      }
      else{
      trasera1.style.backgroundColor="green"
      trasera2.style.backgroundColor="green"

      
      this.contadorpos++;
      contadorpositivo.innerHTML = this.contadorpos+"";
      console.log(this.contadorpos);

      if(this.contadorpos == 5){
        alert("HAS GANADO");
      }
      }


    }, 1000);

  }



  cargarTablero(){
    let tablero = document.getElementById("tablero");
    let tarjetas=[]
    for(let i=0; i<10;i++){
      tarjetas.push(`
      <div class="area-tarjeta">
          <div class="tarjeta">

            <div class="cara superior">
            <i class="fab fa-accusoft"></i>
            </div>

            <div class="cara trasera">
              <i class="fas fa-adjust"></i>
            </div>

          </div>
        </div>
      
      `);
    }
    tablero.innerHTML=tarjetas.join(" ");
  }


}
