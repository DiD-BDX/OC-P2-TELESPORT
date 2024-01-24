import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Participation } from '../../core/models/Participation';
import { OlympicCountry } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent {
  country?: OlympicCountry; // Déclaration de la variable country
  pageId: string | null = null;
  chartData: any[] = [];
  countryNameData : any[] = [];
  filterCountryNameData : any[] = [];
  
  

  constructor(private olympicService: OlympicService,  private route: ActivatedRoute) {
    // peupler le tableau countryNameData
    this.olympicService.getOlympics().subscribe(participations => {
      this.countryNameData = participations.map(p => {
        return {
          country: p.country,
          participations: [p]
        };
      });
    });
  }

  // creation des fonctions de calcul pour affichage dans le DOM
  getTotalParticipations(): number { // <-- affiche le nbre de participations du pays selectionné
    return this.filterCountryNameData.reduce((sum, p) => sum + p.participations.length, 0);
  }
  getTotalMedals(): number { // <-- affiche le nbre de médailles du pays selectionné
    return this.filterCountryNameData.reduce((sum: number, country) => {
      const countryMedals = country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
      return sum + countryMedals;
    }, 0);
  }
  getTotalAthletes(): number { // <-- affiche le nbre d'athletes du pays selectionné
    return this.filterCountryNameData.reduce((sum: number, country) => {
      const countryAthletes = country.participations.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
      return sum + countryAthletes;
    }, 0);
  }


    ngOnInit(): void {
      this.pageId = this.route.snapshot.paramMap.get('id');
      if (this.pageId === null) {
        // Gérer le cas où 'pageId' est null
        console.error('pageId is null');
        return;
      }
      console.log('this.pageId: ', this.pageId);

      // Trouver le pays spécifié dans le tableau countryNameData
      let country = this.countryNameData.find(c => c.country === this.pageId);
      console.log('country: ', country);
      // Si le pays a été trouvé et qu'il a des participations
      if (country && country.participations) {
        // Assigner les participations à filterCountryNameData
        this.filterCountryNameData = country.participations;
      } else {
        // Sinon, assigner un tableau vide à filterCountryNameData
        this.filterCountryNameData = [];
      }
      console.log('tableau filtercountryNameData: ', this.filterCountryNameData);
      let participations = this.filterCountryNameData.flatMap(p => p.participations);// <--on applatit le tableau filterCountryNameData
      this.chartData = participations.map(p => ({
        name: p.year,
        value: p.medalsCount
      }));

    }
    
  }
  
  