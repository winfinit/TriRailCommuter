import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StationsModel } from '../../models/stations';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ScheduleService } from '../../providers/schedule-service';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'page-schedule',
	templateUrl: 'schedule.html',
	providers: [ScheduleService]
})
export class SchedulePage {
	public schedule: any = [];
	fromStation: string;
	toStation: string;
	scheduleDay: string;
	testRadioOpen: boolean;
	stations: StationsModel = new StationsModel();
	private storage: Storage;

	constructor(
		public navCtrl: NavController, 
		public alerCtrl: AlertController, 
		public scheduleService: ScheduleService,
		public loadingCtrl: LoadingController) {
		this.storage = new Storage();



		Observable.forkJoin(
			this.storage.get('fromStation'),
			this.storage.get('toStation'),
			).subscribe(
			data => {
				let fromStation = data[0];
				let toStation = data[1];

				console.log("data from forkJoin", data);

				if ( toStation ) {
					this.toStation = toStation;
				} else {
					this.toStation = this.stations.stationsList[17];
				}
				if (fromStation) {
					this.fromStation = fromStation;
				} else {
					this.fromStation = this.stations.stationsList[0];
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
				fromStation: this.fromStation,
				toStation: this.toStation
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
			let tempStation: string = this.fromStation;
			this.fromStation = this.toStation;
			this.toStation = tempStation;
			this.loadSchedule();
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
					} else {
						this.fromStation = data;
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

	// enableBackdropDismiss to not allow dismiss without cancel
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
