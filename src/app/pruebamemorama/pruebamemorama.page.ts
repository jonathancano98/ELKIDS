import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pruebamemorama',
  templateUrl: './pruebamemorama.page.html',
  styleUrls: ['./pruebamemorama.page.scss'],
})
export class PruebamemoramaPage implements OnInit {

  constructor() { }

  iconos;
  Cartaspartedetras: any[]=[];
  selecciones: any[]=[];

  ngOnInit() {

    for(let i=0;10>i;i++){
    this.Cartaspartedetras.push("HOLA");
    }
  }

  
  Hola(){
    console.log("HOLA");
  }

  cargarIconos(){
    console.log("HOLA")
  }


  

  seleccionartarjeta(i:number){

    let tarjeta = document.getElementById("tarjeta"+i);
    console.log(tarjeta,i);
    if(tarjeta.style.transform != "rotateY(180deg)"){
      tarjeta.style.transform = "rotateY(180deg)";
      this.selecciones.push(i);
    }
    if(this.selecciones.length == 2){
      // this.deseleccionar(this.selecciones);
      this.selecciones=[];
    }


  }

  // deseleccionar(seleccioar){

  //   setTimeout(() => {
      
  //     let tarjeta1=document.getElementById("tarjeta"+this.selecciones[0]);
  //     let tarjeta2=document.getElementById("tarjeta"+this.selecciones[1]);

  //     let trasera1=document.getElementById("trasera"+this.selecciones[0]);
  //     let trasera2=document.getElementById("trasera"+this.selecciones[1]);

  //     if(trasera1.innerHTML !=trasera2.innerHTML){
  //       let tarjeta1=document.getElementById("tarjeta"+this.selecciones[0]);
  //       let tarjeta2=document.getElementById("tarjeta"+this.selecciones[1]);
  //       tarjeta1.style.transform = "rotateY(0deg)";
  //       tarjeta2.style.transform = "rotateY(0deg)";
  //     }
  //     trasera1.style.background="plum"
  //     trasera2.style.background="plum"



  //   }, 1000);

  // }



  cargarTablero(){
    this.cargarIconos();
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
