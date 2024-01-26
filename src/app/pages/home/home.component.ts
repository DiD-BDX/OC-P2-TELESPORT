import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { OlympicCountry, detailsData } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public olympics$: Observable<OlympicCountry[]> = of([]);
  PieChartResults: detailsData[] = [];
  countryNameData : OlympicCountry[] = [];
  totalUniqueJOs: number = 0;
  
  constructor(private olympicService: OlympicService, private router: Router) {}
  
  onSelect(data: detailsData): void {
    this.router.navigate(['/details', data.name]);
  }
  ngOnInit(): void {
    this.olympicService.getCountryNameData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.countryNameData = data;
        this.totalUniqueJOs = this.olympicService.getTotalUniqueJOs(data);
      });

    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(olympicCountries => {
        this.PieChartResults = olympicCountries.map(p => {
          let totalParticipations = p.participations.length;
          return {
            label: p.country,
            name : p.country,
            value: totalParticipations,
          };
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
