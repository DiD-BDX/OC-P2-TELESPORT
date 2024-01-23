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
  
  PieChartResults: any[] = [];
  
  
  constructor(private olympicService: OlympicService) {}


  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    let NAME: string[] = []; // Déclaration du tableau NAME
    this.olympics$.subscribe(olympicCountries => {
      
      this.PieChartResults = olympicCountries.map(OlympicCountry => {
        let totalParticipations = OlympicCountry.participations.length;
        console.log(`Country: ${OlympicCountry.country}`);
        NAME.push(OlympicCountry.country);
  
        return {
          id: OlympicCountry.id,
          name: OlympicCountry.country,
          value: totalParticipations
        };
      });
  
      console.log(NAME); // Affichage du contenu du tableau NAME
      
    });
  }
}
