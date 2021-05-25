import { Component, OnInit } from '@angular/core';
import{DbServiceService} from 'src/app/db-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
})
export class MenuPrincipalPage implements OnInit {
  

  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {
     console.log("Estamos en el menu-LOGIN");
  }


  irJuegos(){        
    
    this.router.navigate(['/mis-juegos']);
  }



  atras(){
    this.router.navigate(['/login']);

  }

}
