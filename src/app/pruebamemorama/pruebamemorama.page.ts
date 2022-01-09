import { Component, OnInit , AfterViewInit, AfterContentInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { table } from 'console';
import{DbServiceService} from 'src/app/db-service.service';
import * as URL from '../URLS/urls';
import { alumnojuegomemorama } from '../alumnojuegomemorama';
// import Swal from 'sweetalert2';


@Component({
  selector: 'app-pruebamemorama',
  templateUrl: './pruebamemorama.page.html',
  styleUrls: ['./pruebamemorama.page.scss'],
})
export class PruebamemoramaPage implements OnInit ,AfterViewChecked {
  entrar: any;
 segundos:any;
 minutos:any;
  dificultad: string;
  fondo: any;
  Nombreinicial: any;
  familiainfo: any;

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
idcartasjuego:any;
relacion=false;
separador=",";
idcartasseparadas:any[]=[];
puntuacionCorrecta:any;
puntuacionIncorrecta:any;
identificador:any;
familiaparafondo:any;
puntosposibles:number;

//Tiempo
tiempoinicial:any;
tempo=false;
tiempoduracion:number;



   ngOnInit() {

    console.log("ionViewWillEnter");
    this.entrar=0;

    console.log(this.minutos,this.segundos);
    

    // RECOJO LAS VARIABLES juegoDeMemoramaId y la familiaId
    this.juegoDeMemoramaId=localStorage.getItem("juegoDeMemoramaId");
    this.familiaId = localStorage.getItem("familiaId");
    this.idcartasjuego = localStorage.getItem("idcartas");
    // this.relacion = localStorage.getItem("relacion");
    this.puntuacionCorrecta =localStorage.getItem("puntuacionCorrecta");
    this.puntuacionIncorrecta =localStorage.getItem("puntuacionIncorrecta");
    this.dificultad=localStorage.getItem("dificultad")
    this.tiempoduracion=Number(localStorage.getItem("tiempoduracion"));
    
    if (this.dificultad==="facil"){
      this.puntosposibles=4;
    }
    else if(this.dificultad==="media"){
      this.puntosposibles=5;
    }
    else{
      this.puntosposibles=6;
    }

    this.Relacion();

    console.log("RELACIOOON",this.relacion)

    
    this.DividirIDcartas(this.idcartasjuego,this.separador);
    console.log(this.idcartasjuego[0]);
    console.log("juegoDeMemoramaId:", this.juegoDeMemoramaId,"familiaId:",this.familiaId,"idcartas",this.idcartasjuego);
    
    this.dbService.DimesiAlumnoEsdelJuegoMemorama(this.juegoDeMemoramaId,localStorage.getItem("alumnoID")).subscribe(alumno=>{
      this.identificador=alumno[0].id;
      console.log(alumno[0].id)})

    // Pido las cartas del Alumno
    this.DameLasCartasDelAlumno();

    

  }

  ngAfterViewChecked(){
  this.DimensionesTablero();

  }

  async Relacion(){
    this.familiainfo = await this.dbService.Damefondo(this.familiaId).toPromise();
    this.relacion=this.familiainfo[0].relacion;
    console.log("La RELACION:",this.relacion);
  }
  
  

  DividirIDcartas(idcartasjuego,separador){
    
      var arrayDeCadenas = idcartasjuego.split(separador);
      this.idcartasseparadas=arrayDeCadenas;
      for (var i=0; i < arrayDeCadenas.length; i++) {
      console.log(arrayDeCadenas[i]);
      }
  }
async DameLasCartasDelAlumno() {

    for(let i=0;this.idcartasseparadas.length>i;i++){
      let carta = await this.dbService.DamecartasdelafamiliaporID(this.familiaId,this.idcartasseparadas[i]).toPromise();

      if(this.relacion === false){
        console.log("Sin Relacion");
        this.damecartasdelafamilia.push(carta[0]);
        this.damecartasdelafamilia.push(carta[0]);
        console.log("false",this.damecartasdelafamilia);
      }
      else{
        console.log("Con Relacion")
        this.damecartasdelafamilia.push(carta[0]);
        console.log("true",this.damecartasdelafamilia);
        
      }

    }

console.log(this.damecartasdelafamilia);

                     // this.damecartasdelafamilia2=this.damecartasdelafamilia;
                        
                         console.log("damecartasdelafamilia",this.damecartasdelafamilia);
                          this.MezclarArray();
                          this.PreparaImagenesCartasQueTengo();
                          this.PreparaFondo();
                          this.preparado = true;
                          this.tempo=true;
                          this.DimensionesTablero();
    
  
  }

  async PreparaFondo(){

    console.log("VAMOS A PREPARAR EL FONDOOOO");
    let fondor = document.getElementById("fondo");

    this.fondo = await this.dbService.Damefondo(this.familiaId).toPromise();
    this.Nombreinicial= this.fondo[0].Nombre;
    this.familiaparafondo =URL.ImagenesCartasdetras + this.fondo[0].ImagenFamilia;
    console.log("FONDOOOOOOOO:",this.fondo[0],this.familiaparafondo);

    fondor.style.backgroundImage = "url('"+this.familiaparafondo+"')";


  }

  tiempo(){

    this.tiempoinicial=this.tiempoduracion;
    let coutdownEl = document.getElementById("countdown");
    this.tempo=true;
    // coutdownEl.innerHTML="Inicio Juego";

    let tiempo = this.tiempoinicial*60;

    var minutos2;
    var segundos2;

    this.minutos=minutos2;
    this.segundos=segundos2;

    // console.log("Minutos2",minutos2,"Segundos2",segundos2);

    setInterval(updatecountdown,1000);


    function updatecountdown(){
      

      var minutos = Math.floor(tiempo/60);
      var segundos = tiempo % 60;
      
      minutos2=minutos;
      segundos2=segundos;

      //console.log("Minutos",minutos,"Segundos",segundos);

      
      coutdownEl.innerHTML=" "+minutos+":"+segundos+" ";


      if((minutos==0)&&(segundos==5)){

        let crono = document.getElementById("countdown");
        crono.style.animationName="temporizador";

        for(let i=0;9>=i;i++){

        let tarjetas= document.getElementById("tarjeta"+i);

        if (tarjetas.style.transform === "rotateY(180deg)"){}

        else{
          tarjetas.style.animationName="tarjetasmovimiento";

        }
     
        }


      }

     
      if((minutos>=0)&&(segundos>=0)){


        tiempo--;
      }

      else{
        alert("Se terminó el juego");
        minutos2=minutos;
        segundos2=segundos;
      }
    }
  }

  DimensionesTablero(){

    let tablero = document.getElementById("tablero");
    let title = document.getElementById("Title");
    let contador = document.getElementById("puntuacion");
    let reloj =  document.getElementById("countdown");
    let ayuda =  document.getElementById("ayuda");

    // let cartas = document.getElementById("areatarjeta");
    // let cartassup = document.getElementById("carasuperior");
    //console.log("TABLERO:",tablero);

    //console.log("DIFICULTAD: ",this.dificultad)

    if ( this.dificultad === "media"){
    tablero.style.gridTemplateColumns = "auto auto auto auto auto";
    //console.log("Estamos en MEDIA")
    }
    else if(this.dificultad === "facil"){
      tablero.style.gridTemplateColumns = "auto auto auto auto";
      //console.log("Estamos en FACIL")

    }
    else{

     
      title.style.marginTop="630px";
      contador.style.marginTop="-64px";
      reloj.style.marginLeft="229px";
      ayuda.style.marginTop="-50px";
     


      for(let i=0;this.Cartaspartedetras.length>i;i++){

        let areatarjetas  = document.getElementById("areatarjeta"+i);
        let cartas = document.getElementById("tarjeta"+i);
        let cartassup = document.getElementById("carasuperior"+i);
        let caratras = document.getElementById("trasera"+i);
        let imagentras = document.getElementById("CARTAATRAS"+i);
        let imagendel = document.getElementById("CARTADELANTE"+i);

        areatarjetas.style.width="105px";
        areatarjetas.style.height="135px";
        cartas.style.width="105px";
        cartas.style.height="135px";
        cartassup.style.width="105px";
        cartassup.style.height="135px";
        caratras.style.width="105px";
        caratras.style.height="135px";
        imagentras.style.width="105px";
        imagentras.style.height="135px";
        imagendel.style.width="105px";
        imagendel.style.height="135px";

      }


      tablero.style.marginBottom = "60px";
      tablero.style.rowGap = "5px";
      tablero.style.gridTemplateColumns = "auto auto auto auto";
     

     // console.log("Estamos en DIFICIL")
    }
    
    
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
      this.Cartaspartedetras[i]=URL.ImagenesCartas + elem.imagenDetras;
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

Pillarcartas(i:number){

  this.entrar++;

  //ESTO SE HACE PARA QUE ENTRE UNA VEZ EN EL TEMPORIZADOR Y NO MULTIPLES
  if(this.entrar<=1){
    this.tiempo();
  }

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
     
      if(this.relacion === false){

        console.log("Caso sin Relacion");
        
      let trasera1=document.getElementById("trasera"+seleccionesrecibidas[0]);
      let trasera2=document.getElementById("trasera"+seleccionesrecibidas[1]);

      console.log("TRASERA1: ",trasera1,"TRASERA2: ",trasera2);
      console.log("TRASERA1 HTML: ",trasera1.innerHTML,"TRASERA2 HTML: ",trasera2.innerHTML);

      if(this.damecartasdelafamilia2[seleccionesrecibidas[0]].Nombre!=this.damecartasdelafamilia2[seleccionesrecibidas[1]].Nombre){
       
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

      if(this.contadorpos == this.puntosposibles){
        let tiemporealizado = document.getElementById("countdown");
        let time;

        time = tiemporealizado.innerText;

        let puntuacion;
        puntuacion= (this.contadorpos*this.puntuacionCorrecta)-(this.contadorneg*this.puntuacionIncorrecta);
        console.log(puntuacion, time);
        
        

        let alumno=  new alumnojuegomemorama(localStorage.getItem("alumnoID"),this.juegoDeMemoramaId,puntuacion,time,this.identificador);

        this.dbService.EstablecePuntuacionAlumnoPorID(alumno).subscribe(alumno=>{console.log(alumno)});
        
        alert("Juego Finalizado: " + puntuacion+" Tiempo: "+time);
      }
      }

    }
    
    else{

      console.log("Caso con RELACION");
      console.log(this.damecartasdelafamilia2[seleccionesrecibidas[0]]);
      console.log(this.damecartasdelafamilia2[seleccionesrecibidas[1]]);
      let trasera1=document.getElementById("trasera"+seleccionesrecibidas[0]);
      let trasera2=document.getElementById("trasera"+seleccionesrecibidas[1]);
      
      if(this.damecartasdelafamilia2[seleccionesrecibidas[0]].relacion==this.damecartasdelafamilia2[seleccionesrecibidas[1]].id){
        trasera1.style.backgroundColor="green"
      trasera2.style.backgroundColor="green"
      this.contadorpos++;
      contadorpositivo.innerHTML = this.contadorpos+"";
      console.log(this.contadorpos);

      if(this.contadorpos == this.puntosposibles){

        let tiemporealizado = document.getElementById("countdown");
        let time;

        time = tiemporealizado.innerText;

        let puntuacion;
        puntuacion= (this.contadorpos*this.puntuacionCorrecta)-(this.contadorneg*this.puntuacionIncorrecta);
        console.log(puntuacion, time);
        
        

        let alumno=  new alumnojuegomemorama(localStorage.getItem("alumnoID"),this.juegoDeMemoramaId,puntuacion,time,this.identificador);

        this.dbService.EstablecePuntuacionAlumnoPorID(alumno).subscribe(alumno=>{console.log(alumno)});
        
        alert("Juego Finalizado: " + puntuacion+" Tiempo: "+time);

        
      }
    
    }
  else{
    let tarjeta1=document.getElementById("tarjeta"+seleccionesrecibidas[0]);
        let tarjeta2=document.getElementById("tarjeta"+seleccionesrecibidas[1]);
        tarjeta1.style.transform = "rotateY(0deg)";
        tarjeta2.style.transform = "rotateY(0deg)";
        
        this.contadorneg++;
        contadornegativo.innerHTML=this.contadorneg+"";
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
