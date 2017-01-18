import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation, Geoposition, PositionError } from 'ionic-native';
import { StationsModel } from '../../models/stations';
import { Storage } from '@ionic/storage';
import { Observable }     from 'rxjs/Observable';
import { EtaspotService } from '../../providers/etaspot-service';

declare var google;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [EtaspotService]
})

export class HomePage {
	testRadioOpen: boolean;
	fromStation: string;
	toStation: string;
	stations: StationsModel = new StationsModel();
	private storage: Storage;
	toStationLatLng: any;
	fromStationLatLng: any;
	toStationIndex: number;
	fromStationIndex: number;
	direction: string;
	departureTimeSchedule: string;
	departureIn: string;
	arrivalTimeSchedule: string;
	arrivalIn: string;

	@ViewChild('map') mapElement: ElementRef;
	map: any;

	constructor(
		public navCtrl: NavController, 
		public alerCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public etaspotService: EtaspotService) {
		this.storage = new Storage();

		Observable.forkJoin(
			this.storage.get('fromStation'),
			this.storage.get('toStation'),
			).subscribe(
			data => {
				let fromStation = data[0];
				let toStation = data[1];

				if (fromStation) {
					this.fromStation = fromStation;
				} else {
					this.fromStation = this.stations.stationsList[0];
				}
				if ( toStation ) {
					this.toStation = toStation;
				} else {
					this.toStation = this.stations.stationsList[17];
				}


				this.initStationMetadata();
				this.loadMap();
			},
			err => {
				console.error('unable to get to/from');
			}
			);

		}

		initStationMetadata() {
			// reverse stations based on closest station
			this.toStationIndex = this.stations.stationsIndex[this.toStation];
			this.fromStationIndex = this.stations.stationsIndex[this.fromStation];

			let toStationCoordinates: {lat: number, lng: number } = this.stations.stationsCoordinates[this.toStationIndex];
			let fromStationCoordinates: {lat: number, lng: number } = this.stations.stationsCoordinates[this.fromStationIndex];
			// this.stations.stationsCoordinates[0]

			this.toStationLatLng = new google.maps.LatLng(toStationCoordinates.lat, toStationCoordinates.lng);
			this.fromStationLatLng = new google.maps.LatLng(fromStationCoordinates.lat, fromStationCoordinates.lng);

			if ( this.toStationIndex > this.fromStationIndex ) {
				this.direction = "NorthBound";
			} else {
				this.direction = "SouthBound";
			}

			this.updateSchedule();
		}

		updateSchedule() {

			// this.etaspotService.load(this.toStationIndex).subscribe(res => {
			// 	console.log('toStation schedule', res);
			// });
			console.log('direction is', this.direction);
			this.etaspotService.getStopEtas(this.fromStationIndex, this.direction).subscribe(res => {
				console.log('fromStationIndex schedule', res);

				// set departure time
				let closestTrain = res[0];

				if ( closestTrain.status === 'On Time' ) {
					this.departureTimeSchedule = closestTrain.schedule;
				} else {
					this.departureTimeSchedule = closestTrain.status;
				}

				this.departureIn = closestTrain.minutes;

				// find arrival time
			});

		}

		doRadio(direction) { /* direction is "to" or "from" */

		var alertInputs: Array<{type: string, label: string, value: string, checked?: boolean}> = [];
		this.stations.stationsList.forEach(stationName => {
			console.log(stationName);
			console.log(alertInputs);
			alertInputs.push({
				type: 'radio',
				label: stationName,
				value: stationName
			});
		});

		// check previously selected station
		//alertInputs[0].checked = true;
		let checkedStationIndex: number;
		if (direction === "to" ) {
			checkedStationIndex = this.stations.stationsIndex[this.toStation];
		} else {
			checkedStationIndex = this.stations.stationsIndex[this.fromStation];
		}

		console.log('checked index station', checkedStationIndex);

		alertInputs[checkedStationIndex].checked = true;

		let alert = this.alerCtrl.create({
			title: "Select station",
			buttons: [
			{
				text: "Cancel",
				role: 'cancel',
				handler: data => {
					console.log('cancel clicked');
				}
			},
			{
				text: 'Ok',
				handler: data => {
					console.log('Radio data:', data, direction);
					this.testRadioOpen = false;

					if (direction === "to") {
						this.toStation = data;
						this.storage.set('toStation', data);
					} else {
						this.fromStation = data;
						this.storage.set('fromStation', data);
					}
				}
			}
			],
			inputs: alertInputs
		});

		alert.present().then(() => {
			this.testRadioOpen = true;
		});
	}

	// Load map only after view is initialize
	ionViewDidLoad(){
		//this.loadMap();
	}

	loadMap(){

		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		console.log('loadMap called');
		//26.4560804,-80.1272338
		//let latLng = new google.maps.LatLng(26.4542553,-80.0931816);

		let mapOptions = {
			center: this.fromStationLatLng,
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		}

		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

		// add stations markers
		this.stations.stationsCoordinates.forEach((latLon, index) => {
			//console.log("test", latLon, this.stations.stationsList[index]);
			new google.maps.Marker({
				position: latLon,
				map: this.map,
				title: this.stations.stationsList[index],
				icon: 'assets/icon/tri-marker.png'
			});
		});

		var directionsDisplay = new google.maps.DirectionsRenderer({
			map: this.map,
			suppressMarkers: true,
			preserveViewport: true,
			polylineOptions: {
				strokeColor: "#68cc67",
				strokeWeight: 13,
				strokeOpacity: 0.7
			}
		});

		// Pass the directions request to the directions service.
		var directionsService = new google.maps.DirectionsService();

		// Set destination, origin and travel mode.
		var request = {
			destination: this.stations.stationsCoordinates[0],
			origin: this.stations.stationsCoordinates[17],
			travelMode: 'TRANSIT'
		};

		directionsService.route(request, function(response, status) {
			if (status == 'OK') {
				// Display the route on the map.
				directionsDisplay.setDirections(response);
			}
		});


		let gpsOptions = {
			frequency: 1000, 
			enableHighAccuracy: true
		}

		let meMarker;

		Geolocation.watchPosition(gpsOptions)
		.catch(err => {
			console.log('error getting watchPosition', err);
			return Observable.throw('unable to get alerts');
		})
		.subscribe((position: Geoposition) => {
			console.log('data from watch position', position);

			if ( position.coords === undefined) {
				console.log('position not available');
				loading.dismiss();
				return;
			} 

			if ( meMarker ) {
				// update marker
				meMarker.setPosition( new google.maps.LatLng( position.coords.latitude, position.coords.longitude ) );


			} else {
				console.log("get current position:", position);
				// create new marker
				meMarker = new google.maps.Marker({
					position: {lat: position.coords.latitude, lng: position.coords.longitude},
					map: this.map,
					title: 'Me',
					icon: 'assets/icon/person-marker.png'
				});
				// remove loader
				loading.dismiss();
			}
			// center map to current position
			this.map.setCenter(meMarker.getPosition());

			let currentLocationLatLng: any = new google.maps.LatLng(
				position.coords.latitude, 
				position.coords.longitude);

			let toStationDistance: number = google.maps.geometry.spherical.computeDistanceBetween(
				this.toStationLatLng, 
				currentLocationLatLng);

			let fromStationDistance: number = google.maps.geometry.spherical.computeDistanceBetween(
				this.fromStationLatLng,
				currentLocationLatLng);

			console.log('to station distance', toStationDistance);
			console.log('from station distance', fromStationDistance);
			if ( toStationDistance < fromStationDistance ) {
				console.log('toStation is closer');
				// flip to and from
				let tempStation: string = this.fromStation;
				this.fromStation = this.toStation;
				this.toStation = tempStation;
				this.initStationMetadata();
			} else {
				console.log('from station is closer, no need to flip anything');
				// let tempStation: string = this.toStation;
				// this.toStation = this.fromStation;
				// this.fromStation = tempStation;
			}
		},
		(err: PositionError) => {
			console.log('unable to get location', err);
			// remove loader
			loading.dismiss();
		});

	}

}
