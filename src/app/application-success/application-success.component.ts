import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-application-success',
  templateUrl: './application-success.component.html',
  styleUrls: ['./application-success.component.scss']
})
export class ApplicationSuccessComponent implements OnInit {

  proposalNumber: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.proposalNumber = +this.route.snapshot.paramMap.get('proposalNumber');
  }

}
