import {Component, ElementRef, ViewChild} from '@angular/core';
import {GoogleMap, Marker} from '@capacitor/google-maps';
import {environment} from '../../environments/environment';
import {Geolocation} from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // @ts-ignore
  @ViewChild('map', { static: false }) mapRef: ElementRef;
  // @ts-ignore
  map: GoogleMap;
  markers: Marker[] = [];

    elements = [
      {
        "latitude": 40.05631946196514,
        "longitude": -3.8439747997882,
        "name": "Element 1"
      },
      {
        "latitude": 40.06631946196514,
        "longitude": -3.8539747997882,
        "name": "Element 2"
      },
      {
        "latitude": 40.07631946196514,
        "longitude": -3.8639747997882,
        "name": "Element 3"
      }
    ];

  constructor() {}

  ionViewDidEnter() {
    this.createMap().then();
  }

  ionViewDidLeave() {
    this.map.destroy().then();
  }

  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.apiKey,
      element: this.mapRef.nativeElement,
      config: {
        center: {
          lat: 40.04631946196514,
          lng: -3.8339747997882
        },
        zoom: 12
      }
    });

    await this.addMarkers();
    await this.map.enableClustering();
  }

  async addMarkers() {
    for (const element of this.elements) {
      const marker: Marker = {
        coordinate: {
          lat: element.latitude,
          lng: element.longitude
        },
        title: element.name,
        snippet: element.name,
        iconUrl: 'assets/icon/markers/marker.png',
      };
      this.markers.push(marker);
    }

    await this.map.addMarkers(this.markers);
  }
}
