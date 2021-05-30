import { Component, OnInit } from '@angular/core';
import{Router} from'@angular/router';
import{DbServiceService} from 'src/app/db-service.service';


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

  perfil: any;



  constructor(private router: Router, private dBservice: DbServiceService) { }

   ngOnInit() {

  }
  
  async ionViewWillEnter()
  {

    console.log("Entramos al Perfil");
    this.perfil = await this.dBservice.dameAlumnoPorId(localStorage.getItem("alumnoID")).toPromise();


  }

  irMenuPrincipal()
  {
    this.router.navigate(['/menu-principal'])
  }






}
