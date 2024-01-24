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
    
    
    this.olympics$.subscribe(olympicCountries => {
      
      this.PieChartResults = olympicCountries.map(p => {
        let totalParticipations = p.participations.length;
        console.log(`Country: ${p.country}`);
        
        
        return {
          id: p.id,
          country: p.country,
          name : p.country,
          value: totalParticipations,
          participations: p.participations,
        };
      });
   
    });
    
  }
  
  onSelect(data: any): void {
    this.router.navigate(['/details', data.name]);
  }
  ngOnInit(): void {
    
    
  }
 
}
