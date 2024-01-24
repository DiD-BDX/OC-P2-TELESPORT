import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicCountry } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> = of([]);
  PieChartResults: OlympicCountry[] = [];
  
  
  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
    let NAME: string[] = []; // Déclaration du tableau NAME
    this.olympics$.subscribe(olympicCountries => {
      
      this.PieChartResults = olympicCountries.map(p => {
        let totalParticipations = p.participations.length;
        console.log(`Country: ${p.country}`);
        NAME.push(p.country);
        
        return {
          id: p.id,
          country: p.country,
          name : p.country,
          value: totalParticipations,
          participations: p.participations,
        };
      });
  
      console.log(NAME); // Affichage du contenu du tableau NAME
   
    });
    
  }
  
  onSelect(data: any): void {
    console.log('PiechartResults:', this.PieChartResults);
    console.log('Data:', data);
    console.log('Item clicked', data.name);
    this.router.navigate(['/details', data.name]);
  }
  ngOnInit(): void {
    
    
  }
 
}
