import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { IAuthentication } from '../models/authentication';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  authenticationInfo: IAuthentication;

  constructor(private authenticationService: AuthenticationService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.authenticationService.getAuthenticationInfo()
      .subscribe(
        (data: IAuthentication) => {
          console.log(JSON.stringify(data));
          this.authenticationInfo = data;
        },
        (err: any) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );
  }

}
