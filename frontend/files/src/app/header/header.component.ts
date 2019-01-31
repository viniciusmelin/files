import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from '../_services/authentication.service';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: User;
  constructor(
    private autheticationService: AutheticationService,
    private router: Router
  ) {}
  ngOnInit() {}

  logout() {
    this.autheticationService.logout();
    this.router.navigate(['/login']);
  }
}
