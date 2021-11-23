import { LeadingComment } from '@angular/compiler';
import { Component, OnInit,AfterViewChecked } from '@angular/core';
import { NumericValueAccessor } from '@ionic/angular';
import { Button } from 'selenium-webdriver';

@Component({
  selector: 'app-wally',
  templateUrl: './wally.page.html',
  styleUrls: ['./wally.page.scss'],
})
export class WallyPage implements OnInit {

  constructor() { }

  //
  text:string;
  Cartaspartedetras: any[]=[];
   
  
  

  ngOnInit() {

  }

  ngAfterViewChecked(){

    const griditem = document.querySelectorAll('.grid-item');
    console.log("GRID-ITEM:",griditem);

  }

  async ionViewWillEnter(){

    this.Cartaspartedetras.push("EY");
    this.Cartaspartedetras.push("como");
    this.Cartaspartedetras.push("no");
    this.Cartaspartedetras.push("tuuuu");

  
    const griditem = document.querySelectorAll('.grid-item');
    console.log("GRID-ITEM:",griditem);

  const pruba = document.querySelectorAll('.pruba');
  console.log(pruba);
  pruba.forEach(pruba => {
    
    
    pruba.addEventListener('click',()=>alert("HAS TOCAO"));
  
  
  
  });

  const boton = document.getElementById('el');

  // boton.onclick = function(){console.log("HOLA")}


  

  ////////////////////////////////////////////////////////////////////////////////WALLYYYYYYYYY
    
    // const botonmovimiento=document.getElementById('butonmove');
    // var pElement = document.getElementById("text");
    // var contador=0;


    // botonmovimiento.onclick=
    
    // function(){
     
    //   let multipl = 25*Math.random();
    //   // botonmovimiento.classList.add('ey');
    //   botonmovimiento.style.marginLeft= multipl+"%";
    //   botonmovimiento.style.marginRight= multipl+"%";
    //   botonmovimiento.style.marginTop= multipl+"%";

    //   contador++;
    //   pElement.innerHTML = contador+"";
      

    
    // }

  ////////////////////////////////////////////////////////////////////////////////WALLYYYYYYYYY


  }

Hola(){
  console.log("EY");
}



}
