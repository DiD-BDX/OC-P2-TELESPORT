import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { Participation } from '../models/Participation';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  countryNameData: OlympicCountry[] = []; // <-- on crée un tableau vide pour stocker les données des pays
  filterCountryNameData: Participation[] = []; // <-- on crée un tableau vide pour stocker les données du pays selectionné
  flatCountryNameData: Participation[] = [];

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap( olympics => {
        this.olympics$.next(olympics);  
      }),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryNameData(): Observable<OlympicCountry[]> { // <-- on utilise un observable pour que les données soient chargées une seule fois dans countryNameData
      return this.getOlympics().pipe(
        map(participationsData => {
          this.countryNameData = participationsData.map(p => {
            return {
              id: p.id,
              country: p.country,
              participations: p.participations,
            };
          });
          return this.countryNameData;
        })
      );
    //}
  }

    // creation des fonctions de calcul pour affichage dans le DOM dans le service pour etre utiliser dans les autres composants
    getTotalMedals(filterCountryNameData: Participation[]): number { // <-- affiche le nbre de médailles du pays selectionné
      return filterCountryNameData.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
    }
    getTotalAthletes(filterCountryNameData: Participation[]): number { // <-- affiche le nbre d'athletes du pays selectionné
      return filterCountryNameData.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
    }
    getTotalUniqueJOs(countryNameData: OlympicCountry[]): number { // <-- affiche le nbre de JOs uniques(y en a 3, 2012, 2016 et 2020)
      const uniqueDates = new Set();
      this.flatCountryNameData = this.countryNameData.flatMap(p => p.participations);// <--on applatit le tableau CountryNameData
      countryNameData.forEach((country: { participations: Participation[] }) => {
        country.participations.forEach((participation: Participation) => {
          uniqueDates.add(participation.year);
        });
      });
  
      return uniqueDates.size;
    } 


}


     