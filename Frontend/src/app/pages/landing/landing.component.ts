import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
//import { AppRoutingModule } from '../app-routing.module';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  getAuthService() {
    return this.authService;
  }

}
