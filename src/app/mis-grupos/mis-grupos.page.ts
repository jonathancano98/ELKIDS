import { Component, OnInit } from '@angular/core';
import{Router} from'@angular/router';
import{DbServiceService} from 'src/app/db-service.service';

@Component({
  selector: 'app-mis-grupos',
  templateUrl: './mis-grupos.page.html',
  styleUrls: ['./mis-grupos.page.scss'],
})
export class MisGruposPage implements OnInit {

  listaGrupos: any[]=[];

  constructor(private router: Router, private dBservice: DbServiceService) { }

  ngOnInit() {

  }

  async ionViewWillEnter()
  {

    console.log("Entramos al Perfil");
    this.listaGrupos = await this.dBservice.dameGruposDeAlumno(localStorage.getItem("alumnoID")).toPromise();


  }


  irMenuPrincipal()
  {
    this.router.navigate(['/menu-principal'])
  }


}
