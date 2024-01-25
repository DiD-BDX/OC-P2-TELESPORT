import { Component } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent {
  //country?: OlympicCountry; // Déclaration de la variable country
  pageId: string | null = null;
  chartData: any[] = [];
  countryNameData : any[] = [];
  filterCountryNameData : any[] = [];
  
  

  constructor(private olympicService: OlympicService,  private route: ActivatedRoute) {
    this.olympicService.getCountryNameData().subscribe(data => { // <-- on souscrit à l'observable getCountryNameData() du service
      this.countryNameData = data;
    });
  }

  getTotalParticipations(): number { // <-- affiche le nbre de participations du pays selectionné en important une methode du service
    return this.olympicService.getTotalParticipations(this.filterCountryNameData);
  }
  getTotalMedals(): number { // <-- affiche le nbre de médailles du pays selectionné en important une methode du service
    return this.olympicService.getTotalMedals(this.filterCountryNameData);
  }
  
  getTotalAthletes(): number { // <-- affiche le nbre d'athletes du pays selectionné en important une methode du service
    return this.olympicService.getTotalAthletes(this.filterCountryNameData);
  }
  

    ngOnInit(): void {
      this.pageId = this.route.snapshot.paramMap.get('id');
      if (this.pageId === null) {
        // Gérer le cas où 'pageId' est null
        console.error('pageId is null');
        return;
      }

      // filtrer le tableau countryNameData et Trouver le pays spécifié
      let country = this.countryNameData.find(c => c.country === this.pageId);
       if (country && country.participations) { // Si le pays a été trouvé et qu'il a des participations 
        this.filterCountryNameData = country.participations; // Assigner les participations à filterCountryNameData
      } else {
        this.filterCountryNameData = []; // Sinon, assigner un tableau vide à filterCountryNameData
      }
      let participations = this.filterCountryNameData.flatMap(p => p.participations);// <--on applatit le tableau filterCountryNameData
      this.chartData = participations.map(p => ({
        name: p.year,
        value: p.medalsCount
      }));

    }
    
  }
  
  