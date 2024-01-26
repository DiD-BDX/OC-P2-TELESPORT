import { Component } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';
import { Participation } from '../../core/models/Participation';
import { OlympicCountry, barChartData, detailsData } from '../../core/models/Olympic';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class DetailsComponent {
  //country?: OlympicCountry; // Déclaration de la variable country
  pageId: string | null = null;
  chartData: barChartData[] = [];
  countryNameData : OlympicCountry[] = [];
  filterCountryNameData : Participation[] = [];
  
  

  constructor(private olympicService: OlympicService,  private route: ActivatedRoute) {
    this.olympicService.getCountryNameData().subscribe(data => { // <-- on souscrit à l'observable getCountryNameData() du service
      this.countryNameData = data;
    });
  }

  getTotalParticipations(): number { // <-- affiche le nbre de participations du pays selectionné en important une methode du service
    return this.filterCountryNameData.length;
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
      let countryFound = this.countryNameData.find(c => c.country === this.pageId);
       if (countryFound && countryFound.participations) { // Si le pays a été trouvé et qu'il a des participations 
        this.filterCountryNameData = countryFound.participations; // Assigner les participations à filterCountryNameData
      } else {
        this.filterCountryNameData = []; // Sinon, assigner un tableau vide à filterCountryNameData
      }
      
      this.chartData = this.filterCountryNameData.map(p => ({ // <-- on utilise la méthode map() pour créer un nouveau tableau
        name: p.year, // avec les données de filterCountryNameData pour l'affichage du graphique
        value: p.medalsCount,
      }));
    }
    
  }
  
  