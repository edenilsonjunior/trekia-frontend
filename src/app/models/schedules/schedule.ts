export type Schedule =  {
  id: number;
  tripName: string;
  plannedAt: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  currentLocalBalance: number;
  currencyCode: string;
  minTemperature: number;
  maxTemperature: number;
  precipitationChance: number;
}