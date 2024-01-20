import { Component, OnInit } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { OlympicCountry } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> = of([]);

  
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
    let NAME: string[] = []; // Déclaration du tableau NAME
    this.olympics$.subscribe(olympicCountries => {
      
      olympicCountries.forEach(olympicCountry => {
        let totalParticipations = 0;
        totalParticipations += olympicCountry.participations.length;
        console.log(`Total Participations: ${totalParticipations}`);
        console.log(`Country: ${olympicCountry.country}`);
        NAME.push(olympicCountry.country);
      });
      console.log(NAME); // Affichage du contenu du tableau NAME
    });

  }
}
