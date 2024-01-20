import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  pieChartData = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
