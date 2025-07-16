import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { DashboardSchedule } from '../../models/dashboard/dashboardSchedule';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-map.html',
  styleUrls: ['./trip-map.scss']
})
export class TripMapComponent implements AfterViewInit, OnChanges {
  @Input() schedules: DashboardSchedule[] = [];
  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markers: L.Marker[] = [];
  private polyline?: L.Polyline;

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes['schedules']) {
      this.updateMap();
    }
  }

  private initMap() {

    const options = {
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      touchZoom: true,
      attributionControl: false
    };

    if (!this.schedules.length) {
      // Centraliza no mundo se não houver roteiro
      this.map = L.map(this.mapElement.nativeElement, {
        center: [0, 0],
        zoom: 2,
        ...options
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
      return;
    }

    const center: [number, number] = [
      this.schedules[0].latitude,
      this.schedules[0].longitude
    ];

    this.map = L.map(this.mapElement.nativeElement, {
      center,
      zoom: 13,
      ...options
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.updateMap();
  }

  private updateMap() {
    if (!this.map) return;
    // Limpa marcadores anteriores
    this.markers.forEach(m => m.remove());
    this.polyline?.remove();

    if (!this.schedules.length) {
      this.map.setView([0, 0], 2);
      return;
    }

    this.markers = this.schedules.map((s, i) => {
      return L.marker([s.latitude, s.longitude])
        .addTo(this.map!)
        .bindPopup(s.title);
    });

    // Desenha linha ligando os pontos (roteiro)
    if (this.schedules.length > 1) {
      const latlngs = this.schedules.map(s => [s.latitude, s.longitude]) as [number, number][];
      this.polyline = L.polyline(latlngs, { color: '#2196F3', dashArray: '8 8' }).addTo(this.map!);
      this.map!.fitBounds(this.polyline.getBounds(), { padding: [30, 30] });
    } else {
      this.map!.setView([this.schedules[0].latitude, this.schedules[0].longitude], 13);
    }
  }
}
