/* eslint-disable prefer-const */
/* eslint-disable no-trailing-spaces */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GeoService } from '../geo.service';

// eslint-disable-next-line no-var
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map: any;

  currentPosition: any = null;



  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

  infoWindows: any = [];
  markers: Array<any> = [];

  showError = false;

  constructor(private geo: GeoService, public alertController: AlertController) {
    this.geo.getLocations().subscribe((res: any) => {
        console.log(res);
        let teste = res;

        teste.forEach(element => {
          // console.log(element)
          this.markers.push({latitude: element.latitude, longitude: element.longitude});
        });

        console.log(this.markers);
    }, (err) => {
      console.log(err);
    });
    this.getUserLocation();
  }

  ionViewDidEnter() {

    this.showMap();
  }



  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {

          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

        },
        () => {
          this.currentPosition = {
            lat: -23.7611568,
            lng: -46.8069312
          };
        }
      );
    } else {
      this.currentPosition = {
        lat: -23.7611568,
        lng: -46.8069312
      };
    }
  }

  showMap() {
      const location = new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng);

    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    // Create the search box and link it to the UI element.
    const input = document.getElementById('pac-input') as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', () => {
    searchBox.setBounds(this.map.getBounds());
    });

    this.addMarkers(this.markers);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
      this.markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        this.markers.push(
          new google.maps.Marker({
            map: this.map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });


    this.addNewMarkers();
  }

  async addNewMarkers() {



    await this.map.addListener('click',  (mapsMouseEvent: any) => {


      this.closeAllInfoWindows();

      let position = mapsMouseEvent.latLng;

      let marker = new google.maps.Marker({
        position,
        latitude: mapsMouseEvent.lat,
        longitude: mapsMouseEvent.lng
      });

      this.markers.push({
        latitude: mapsMouseEvent.lat,
        longitude: mapsMouseEvent.lng
      });

      this.geo.addLocation({
        latitude: mapsMouseEvent.latitude,
        longitude: mapsMouseEvent.latitude});



      console.log(mapsMouseEvent.latLng);

      // alert(mapsMouseEvent.latLng.lat);
      this.presentAlert();

      marker.setMap(this.map);
      this.addInfoWindowToMarker(marker);

    });
  }

  addMarkers(markers) {
    for(let marker of markers) {
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker = new google.maps.Marker({
        position,
        latitude: marker.latitude,
        longitude: marker.latitude
      });
      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);


    }

  }

  addInfoWindowToMarker(mapMarker) {
    let infoWindowContent = `<div id="content">` +
                            `<h2 id="firstheading" class="firstheading">` + mapMarker.title  + `</h2>` +
                            `<p>Latitude ` + mapMarker.latitude + `</p>` +
                            `<p>Longitude ` + mapMarker.longitude + `</p>` +
                            `</div>`;

      let infoWindow = new google.maps.InfoWindow({
        content : infoWindowContent,

      });

      mapMarker.addListener('click', () => {
        this.closeAllInfoWindows();
        infoWindow.open(this.map, mapMarker);
      });

      this.infoWindows.push(infoWindow);
    }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Algum foco de incendio?!',
      message: 'Indique-nos apenas pressionando a região aproximada.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Prosseguir',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Atenção',
      subHeader: 'Novo Foco',
      message: '<p style=""> <ion-icon name="checkmark-circle" style="color: green;"></ion-icon> Salvo com sucesso </p> <p>Será analisado e enviado a nosso corpo de bombeiros</p>',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


}
