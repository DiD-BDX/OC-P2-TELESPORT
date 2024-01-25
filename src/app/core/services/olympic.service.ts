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
  private participation$ = new BehaviorSubject<Participation[]>([]);
  countryNameData: any[] = []; // <-- on crée un tableau vide pour stocker les données des pays
  filterCountryNameData: any[] = []; // <-- on crée un tableau vide pour stocker les données des pays filtrés

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return forkJoin({
      olympics: this.http.get<OlympicCountry[]>(this.olympicUrl),
      participations: this.http.get<Participation[]>(this.olympicUrl)
    }).pipe(
      tap(({ olympics, participations }) => {
        this.olympics$.next(olympics);
        this.participation$.next(participations);
      }),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        this.participation$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
  getParticipations() {
    return this.participation$.asObservable();
  }
  getOlympicCountry(Id: string): Observable<OlympicCountry> {
    return this.http.get<OlympicCountry>(this.olympicUrl);
  }

  getCountryNameData(): Observable<any[]> { // <-- on utilise un observable pour que les données soient chargées une seule fois dans countryNameData
    if (this.countryNameData.length > 0) {
      return of(this.countryNameData);
    } else {
      return this.getOlympics().pipe(
        map(participations => {
          this.countryNameData = participations.map(p => {
            return {
              country: p.country,
              participations: [p]
            };
          });
          return this.countryNameData;
        })
      );
    }
  }

    // creation des fonctions de calcul pour affichage dans le DOM dans le service pour etre utiliser dans les autres composants
    getTotalParticipations(filterCountryNameData: any[]): number { // <-- affiche le nbre de participations du pays selectionné
      return filterCountryNameData.reduce((sum, p) => sum + p.participations.length, 0);
    }
    getTotalMedals(filterCountryNameData: any[]): number { // <-- affiche le nbre de médailles du pays selectionné
      return filterCountryNameData.reduce((sum: number, country) => {
        const countryMedals = country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
        return sum + countryMedals;
      }, 0);
    }
    getTotalAthletes(filterCountryNameData: any[]): number { // <-- affiche le nbre d'athletes du pays selectionné
      return filterCountryNameData.reduce((sum: number, country) => {
        const countryAthletes = country.participations.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
        return sum + countryAthletes;
      }, 0);
    }
    getTotalUniqueJOs(countryNameData: any[]): number { // <-- affiche le nbre de JOs uniques(y en a 3, 2012, 2016 et 2020)
      const uniqueDates = new Set();
      console.log('countrynamedata : ', countryNameData);
      let flatCountryNameData = this.countryNameData.flatMap(p => p.participations);// <--on applatit le tableau CountryNameData
      console.log('flatCountryNameData : ', flatCountryNameData);
      flatCountryNameData.forEach((country: { participations: Participation[] }) => {
        country.participations.forEach((participation: Participation) => {
          uniqueDates.add(participation.year);
        });
      });
  
      return uniqueDates.size;
    }
}


     