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
  //private participation$ = new BehaviorSubject<Participation[]>([]);
  countryNameData: OlympicCountry[] = []; // <-- on crée un tableau vide pour stocker les données des pays
  //participationData: Participation[] = []; // <-- on crée un tableau vide pour stocker les données des participations
  filterCountryNameData: Participation[] = []; // <-- on crée un tableau vide pour stocker les données des pays filtrés
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

 /*  getOlympicCountry(Id: string): Observable<OlympicCountry> {
    return this.http.get<OlympicCountry>(this.olympicUrl);
  } */

  getCountryNameData(): Observable<OlympicCountry[]> { // <-- on utilise un observable pour que les données soient chargées une seule fois dans countryNameData
   /*  if (this.countryNameData.length > 0) {
      return of(this.countryNameData);
    } else { */
      return this.getOlympics().pipe(
        map(participationsData => {
          this.countryNameData = participationsData.map(p => {
            return {
              id: p.id,
              country: p.country,
              participations: p.participations,
            };
          });
          console.log('countryNameData : ', this.countryNameData);
          return this.countryNameData;
        })
      );
    //}
  }

    // creation des fonctions de calcul pour affichage dans le DOM dans le service pour etre utiliser dans les autres composants
    /* getTotalParticipations(filterCountryNameData: Participation[]): number { // <-- affiche le nbre de participations du pays selectionné
      return filterCountryNameData.reduce((sum, p) => sum + p.participations.length, 0);
    } */
    getTotalMedals(filterCountryNameData: Participation[]): number { // <-- affiche le nbre de médailles du pays selectionné
      return filterCountryNameData.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
    }
    getTotalAthletes(filterCountryNameData: Participation[]): number { // <-- affiche le nbre d'athletes du pays selectionné
      return filterCountryNameData.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
    }
    getTotalUniqueJOs(countryNameData: OlympicCountry[]): number { // <-- affiche le nbre de JOs uniques(y en a 3, 2012, 2016 et 2020)
      const uniqueDates = new Set();
      console.log('countrynamedata : ', countryNameData);
      this.flatCountryNameData = this.countryNameData.flatMap(p => p.participations);// <--on applatit le tableau CountryNameData
      console.log('flatCountryNameData : ', this.flatCountryNameData);
      countryNameData.forEach((country: { participations: Participation[] }) => {
        country.participations.forEach((participation: Participation) => {
          uniqueDates.add(participation.year);
        });
      });
  
      return uniqueDates.size;
    } 


}


     