import { Component } from '@angular/core';
import { AlertsService } from '../../providers/alerts-service';
import { NavController, LoadingController } from 'ionic-angular';

@Component({
	selector: 'page-alerts',
	templateUrl: 'alerts.html',
	providers: [AlertsService]
})
export class AlertsPage {
	alerts: any = [];
	constructor(
		public navCtrl: NavController, 
		public alertsService: AlertsService, 
		public loadingCtrl: LoadingController) {
		//this.loadAlerts();
		
	}

	ionViewWillEnter() {
		console.log('reloading alerts');
		
		this.loadAlerts();  
	}

	loadAlerts(){
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		this.alertsService.load()
		.subscribe(
			data => {
			//this.alerts = data;
			loading.dismiss();
			console.log('got alerts!', data);
			this.alerts = data;
		},
		error => {
			loading.dismiss();
			console.log('error', error);
		});
	}
}
