import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Participation } from '../../core/models/Participation';
import { OlympicService } from '../../core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  BarChartResults: any[] = [];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Year';
  showYAxisLabel = true;
  yAxisLabel = 'medalsCount';


  constructor() {
    
  }

    ngOnInit(): void {
      
    }
  }
