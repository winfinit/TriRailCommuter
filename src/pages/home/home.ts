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
	fromStation: {extID: string, id: number, triId: number, lat: number, lng: number, name: string, rid: number, shortName: string} = {
		extID: "",
		id: 0,
		lat: 0,
		lng: 0,
		name: "",
		rid: 0, 
		triId: 0,
		shortName: ""
	};
	toStation: {extID: string, id: number, triId: number, lat: number, lng: number, name: string, rid: number, shortName: string} = {
		extID: "",
		id: 0,
		lat: 0,
		lng: 0,
		name: "",
		rid: 0, 
		triId: 0,
		shortName: ""
	};	
	stations: Array<any>;
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
			this.etaspotService.getStations()
			).subscribe(
			data => {
				let fromStation = data[0];
				let toStation = data[1];
				this.stations = data[2];

				if (fromStation) {
					this.fromStation = this.stations[fromStation];
				} else {
					this.fromStation = this.stations[0];
				}
				if ( toStation ) {
					this.toStation = this.stations[toStation];
				} else {
					this.toStation = this.stations[17];
				}

				console.log(this.stations);
				console.log('this.to and from', this.toStation, this.fromStation);

				this.initStationMetadata();
				this.loadMap();
			},
			err => {
				console.error('unable to get to/from');
			}
			);

		}

		initStationMetadata() {
			console.log(this.toStation, this.toStation.lat);
			this.toStationLatLng = new google.maps.LatLng(this.toStation.lat, this.toStation.lng);
			this.fromStationLatLng = new google.maps.LatLng(this.fromStation.lat, this.fromStation.lng);

			if ( this.toStation.id > this.fromStation.id ) {
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
			this.etaspotService.getStopEtas(this.fromStation.id, this.direction).subscribe(res => {
				console.log('fromStationIndex schedule', res);

				if ( res.length < 1 ) {
					// no more trains
					return;
				}
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
		this.stations.forEach(station => {
			alertInputs.push({
				type: 'radio',
				label: station.name,
				value: (parseInt(station.id) - 1).toString()
			});
		});

		// check previously selected station
		//alertInputs[0].checked = true;
		let checkedStationIndex: number;
		if (direction === "to" ) {
			checkedStationIndex = this.toStation.id - 1;
		} else {
			checkedStationIndex = this.fromStation.id - 1;
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
						this.toStation = this.stations[data];
						this.storage.set('toStation', data);
					} else {
						this.fromStation = this.stations[data];
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
		this.stations.forEach((station, index) => {
			//console.log("test", latLon, this.stations.stationsList[index]);
			new google.maps.Marker({
				position: {lat: station.lat, lng: station.lng},
				map: this.map,
				title: station.name,
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
			destination: {lat: this.stations[0].lat, lng: this.stations[0].lng},
			origin: {lat: this.stations[17].lat, lng: this.stations[17].lng},
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
				let tempStation: any = this.fromStation;
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
