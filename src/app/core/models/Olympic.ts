import { Participation } from "./Participation";
export interface OlympicCountry {
    id: number,
    country: string,
    participations: Participation[]
    
}

export interface detailsData {
    name: string | number;
    value: number;
    label: string;
  }
  export interface barChartData {
    name: number;
    value: number;
    
  }
  export interface OlympicAndParticipation {  // <-- on crée une interface pour stocker les données des pays et des participations
    id: number,
    country: string,
    participations: Participation[],
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
}