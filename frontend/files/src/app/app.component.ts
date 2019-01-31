import { Component, OnInit } from '@angular/core';
import { User } from './_models/user.model';
import { AutheticationService } from './_services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'files';
  mostrarMenu = false;
  public user: User;
  constructor(private autheticationService: AutheticationService) { }

  ngOnInit() {
    this.autheticationService.mostrarMenuEmitter.subscribe(
      mostrar => (this.mostrarMenu = mostrar)
    );

    console.log("okk.melin@hotmail.com");
    this.user = this.autheticationService.currentUserValue;

    if (this.autheticationService.currentUserValue) {
      this.mostrarMenu = true;

    } else {
      this.mostrarMenu = false;
    }


  }
}
