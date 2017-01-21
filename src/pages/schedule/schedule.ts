import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StationsModel } from '../../models/stations';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ScheduleService } from '../../providers/schedule-service';
import { EtaspotService } from '../../providers/etaspot-service';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'page-schedule',
	templateUrl: 'schedule.html',
	providers: [ScheduleService, EtaspotService]
})
export class SchedulePage {
	public schedule: any = [];
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
	scheduleDay: string;
	testRadioOpen: boolean;
	stations: any;

	private storage: Storage;

	constructor(
		public navCtrl: NavController, 
		public alerCtrl: AlertController, 
		public scheduleService: ScheduleService,
		public etaspotService: EtaspotService,
		public loadingCtrl: LoadingController) {
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

				console.log("data from forkJoin", data);

				if ( toStation ) {
					this.toStation = this.stations[toStation];
				} else {
					this.toStation = this.stations[17];
				}
				if (fromStation) {
					this.fromStation = this.stations[fromStation];
				} else {
					this.fromStation = this.stations[0];
				}			
				if(!((new Date).getDay() % 6)) {
					this.scheduleDay = "Weekend";
				} else {
					this.scheduleDay = "Weekday";
				}

				console.log('data before loadSchedule', this.toStation, this.fromStation, this.scheduleDay)

				this.loadSchedule();

			},
			err => console.error('error', err)
			);
		}

		loadSchedule(){
			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			loading.present();
			this.scheduleService.load({
				scheduleDay: this.scheduleDay,
				fromStation: String(this.fromStation.triId),
				toStation: String(this.toStation.triId)
			})
			.subscribe(
				data => {
					loading.dismiss();
					this.schedule = data;
					console.log('got schedule!', data);
				}, 
				err => {
					loading.dismiss();
					console.log('unable to get schedule', err);
				}
				);
		}

		swapStations() {
			let tempStation: any = this.fromStation;
			this.fromStation = this.toStation;
			this.toStation = tempStation;
			this.loadSchedule();
		}

		doRadio(direction) { /* direction is "to" or "from" */

		var alertInputs: Array<{type: string, label: string, value: string, checked?: boolean}> = [];
		this.stations.forEach(station => {

			console.log('station', station);
			alertInputs.push({
				type: 'radio',
				label: station.name,
				value: station.id
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
				handler: stationId => {
					console.log('Radio data:', stationId, direction);
					this.testRadioOpen = false;

					// because array index starts with 0
					stationId = stationId - 1;
					if (direction === "to") {
						this.toStation = this.stations[stationId];
					} else {
						this.fromStation = this.stations[stationId];
					}
					this.loadSchedule();
				}
			}
			],
			inputs: alertInputs
		});

		alert.present().then(() => {
			this.testRadioOpen = true;
		});
	}


	doScheduleRadio() { /* direction is "to" or "from" */

	var alertInputs: Array<{type: string, label: string, value: string, checked?: boolean}> = [
	{
		type: 'radio',
		label: 'Weekday',
		value: 'Weekday'
	}, 
	{
		type: 'radio',
		label: 'Weekend',
		value: 'Weekend'
	}
	];

	if ( this.scheduleDay === "Weekday" ) {
		alertInputs[0].checked = true;
	} else {
		alertInputs[1].checked = true;
	}




	let alert = this.alerCtrl.create({
		title: "Select Schedule",
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
				console.log('Radio data:', data);
				this.testRadioOpen = false;
				this.scheduleDay = data;
				this.loadSchedule();
			}
		}
		],
		inputs: alertInputs
	});

	alert.present().then(() => {
		this.testRadioOpen = true;
	});
}


}
