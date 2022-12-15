import {Component, ElementRef, ViewChild} from '@angular/core';
import {GoogleMap, Marker} from '@capacitor/google-maps';
import {environment} from '../../environments/environment';
import {ActionSheetController, ModalController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map', { static: false }) mapRef!: ElementRef;
  map!: GoogleMap;
  markers: Marker[] = [];

    elements = [
      {
        "latitude": 40.05631946196514,
        "longitude": -3.8439747997882,
        "name": "Marker 1"
      },
      {
        "latitude": 40.06631946196514,
        "longitude": -3.8539747997882,
        "name": "Marker 2"
      },
      {
        "latitude": 40.07631946196514,
        "longitude": -3.8639747997882,
        "name": "Marker 3"
      }
    ];

  constructor(public actionSheetController: ActionSheetController,
              public toastController: ToastController) {}

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

    await this.map.setOnMarkerClickListener(async () => {
      const actionSheet = await this.actionSheetController.create({
        header: 'Albums',
        cssClass: 'my-custom-class',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              console.log('Delete clicked');
              this.presentToast('Delete clicked');
            },
          },
          {
            text: 'Share',
            icon: 'share',
            handler: () => {
              console.log('Share clicked');
              this.presentToast('Share clicked');
            },
          },
          {
            text: 'Play (open modal)',
            icon: 'caret-forward-circle',
            handler: () => {
              console.log('Play clicked');
              this.presentToast('Play clicked');
            },
          },
          {
            text: 'Favorite',
            icon: 'heart',
            handler: () => {
              console.log('Favorite clicked');
              this.presentToast('Favorite clicked');
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              this.presentToast('Cancel clicked');
            },
          },
        ],
      });
      await actionSheet.present();

      const { role } = await actionSheet.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);

    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
