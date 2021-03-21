import { R3TargetBinder } from '@angular/compiler';
import { Component } from '@angular/core';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';
import interact from 'interactjs';
import { element } from 'protractor';
import{DbServiceService} from '../db-service.service'
import { ImagenToBackend } from '../home/clases/imagenGuardada';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  constructor(private dBservice: DbServiceService) {}


  clase="";
  girarImagen=0;
  //value = 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699470-icon-4-thumb-up-256.png';
  value='https://c0.klipartz.com/pngpicture/110/30/gratis-png-patron-de-area-de-angulo-cubo-3d-s.png';

  listaFotosPersonajes: any[] = [];
  listaFotosFondos: any[] = [];
  listaFotosObjetos: any[] = [];

  listaRecursos: any[] = [];
  recursoId: Number;
  recursoCargadoPregunta: any = false;
  recursoCargado: any;

  async ngOnInit() {

    this.recuperarListaRecursos();
    console.log('HOLA');
    console.log(this.listaRecursos);

  }


  traeImagenesRecursoLibro(){
  

    this.listaFotosPersonajes = [];
    this.listaFotosFondos  = [];
    this.listaFotosObjetos = [];

    this.recursoCargadoPregunta = true;
    console.log('This');
   // this.recursoCargado = this.listaRecursos.filter (recuro => recuro.id === Number(this.recursoId))[0];
console.log('id: ')
console.log(this.listaRecursos[0].id);

   this.recursoCargado = this.listaRecursos.filter (recuro => recuro.id === this.listaRecursos[0].id)[0];

    console.log(this.listaRecursos);
    console.log(this.recursoCargado);

    this.recursoCargado.imagenes.forEach(element => {
      
      this.dBservice.getImagenesRecurso(this.recursoCargado.carpeta, element.nombre)
      .subscribe((res)=>{

        const blob = new Blob([res.blob()], { type: 'image/png' });
        const reader = new FileReader();

        reader.addEventListener('load', () => {

          var foto = null;
          foto = reader.result.toString();
          var fotoProps = new ImagenToBackend();
          fotoProps.url = foto;
          if(element.especial == true)
          {
            fotoProps.especial = "Especial"
          }
          else
          {
            fotoProps.especial == ""
          }

          fotoProps.nombre = element.nombre


          if (element.tipo == "fondo")
          {
            this.listaFotosFondos.push(fotoProps);
          }
          else if (element.tipo == "personaje")
          {
            this.listaFotosPersonajes.push(fotoProps);

          }
          else if (element.tipo == "objeto")
          {
            this.listaFotosObjetos.push(fotoProps);

          }

        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }


      }, (err)=>{

        console.log(err);
      })

    });
    console.log('end')
  }
  




  //Recuperamos la lista de recursos donde se encuentran las imagenes para la app//
 recuperarListaRecursos() {
    this.listaRecursos = [];

   this.dBservice.recuperarListaRecursos(8)
      .subscribe((res) => {
        console.log(8);
        this.listaRecursos = res;
        console.log(this.listaRecursos);
      }, (err) => {

      })
  }



  ////
  //Funcion que que voltea //
  ////
  invertir(){

    var arrow= document.getElementById("prueba")
    document.getElementById("prueba").classList.remove('draggable');
    document.getElementById("prueba").classList.remove('#rotate-area');
    document.getElementById("prueba").classList.remove('resize-drag');

      var x = arrow.dataset.x;
      var y = arrow.dataset.y;
    
    if(this.girarImagen==0)
    {
    
      if (typeof x != 'undefined' && typeof y != 'undefined') {
        arrow.style.transform = 'translate(' + x + 'px, ' + y + 'px) scaleX(-1)';
      } else {
        arrow.style.transform = 'scaleX(-1)';
      }
    
      this.girarImagen=1
    }else
    {
      console.log("ENTRAMOS AL ELSE")
      if (typeof x != 'undefined' && typeof y != 'undefined') {
        arrow.style.transform = 'translate(' + x + 'px, ' + y + 'px) scaleX(1)';
      } else {
    
        arrow.style.transform = 'scaleX(1)';
      }
    
      this.girarImagen=0;
    
    
    }
    
    }




  ////
  //Función que sirve para agrandar o disminuir el tamaño de la imagen//
  ////
resize(){
  console.log("CAMBIAMOS TAMAÑO");
  
  //document.getElementById("prueba").classList.remove('resize-drag');
  document.getElementById("prueba").classList.remove('#rotate-area');
  document.getElementById("prueba").classList.remove('draggable');
  document.getElementById("prueba").classList.add('resize-drag');


console.log(document.getElementById("prueba"))


  interact('.resize-drag')
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        

        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)'


        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 }
      })
    ],

    inertia: true
  })
}


  ////
  //Función que sirve para modificar la orientacion de la imagen//
  ////
girar(){ 
  var angle = 0
  console.log(document.getElementById("prueba"));
  document.getElementById("prueba").classList.remove('draggable');
  document.getElementById("prueba").classList.remove('resize-drag');
  document.getElementById("prueba").classList.add('#rotate-area');
  console.log('bUENAS')
  interact('#rotate-area').gesturable({
    listeners: {
      move (event) {
        var arrow = document.getElementById('prueba');
        console.log('De revens')

        var x = arrow.dataset.x;
        var y = arrow.dataset.y;
        

        angle += event.da
        
        

        if (typeof x != 'undefined' && typeof y != 'undefined') {
          arrow.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + angle + 'deg' + ')';
        } else {
          arrow.style.transform = 'rotate(' + angle + 'deg' + ')';
        }

        
       // arrow.setAttribute('data-angle','angle');

       /* arrow.style.webkitTransform = arrow.style.transform =
          'rotate(' + angle + 'deg)' */
        
          
  
        /*document.getElementById('angle-info').textContent =
          angle.toFixed(2) + '\u00b0'*/
      }
    }
  })

  



}
////
//Funcion que sirve para arrastrar la imagen//
////
arrastrar(){
this.clase="draggable";
  console.log("llamamos a funcion arrastrar");
  document.getElementById("prueba").classList.remove('#rotate-area');
  document.getElementById("prueba").classList.remove('resize-drag');
  document.getElementById("prueba").classList.add('draggable');
  console.log(document.getElementById("prueba"))


interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

 var rotation = (parseFloat(target.getAttribute('data-angle')) || 0) 

 console.log(rotation);
  // translate the element
  target.style.webkitTransform =
    target.style.transform =
    'translate(' + x + 'px,' + y + 'px) rotate(' + rotation + 'deg)';

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)

}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener
}
}



declare global {
  interface Window {
    dragMoveListener:any;
  }
}

//let FB = window.dragMoveListener; // ok now







