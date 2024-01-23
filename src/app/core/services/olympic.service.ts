import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
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
}

