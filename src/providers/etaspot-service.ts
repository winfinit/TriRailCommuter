import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

/*
  Generated class for the EtaspotService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/
  // http://trirailpublic.etaspot.net/service.php?callback=JSON_CALLBACK

  @Injectable()
  export class EtaspotService {

  	constructor(public http: Http) {
  		//console.log('Hello EtaspotService Provider');
  	}

  	getStopEtas(stopId: number, direction?: string) {

  		let alerts: Array<{time: string, message: string}> = [];
  		let url: string;
  		url = "http://trirailpublic.etaspot.net/service.php";

  		let params: URLSearchParams = new URLSearchParams();
  		params.set('stopID', stopId.toString());
  		params.set('statusData', "1");
  		params.set('token', "TESTING");
  		params.set('service', "get_stop_etas");
  		params.set('callback', "JSON_CALLBACK");

  		return this.http.get(url, { search: params} )
  		.catch(error => {
  			console.log('error getting schedule from etaspot', error);
  			return Observable.throw('unable to get schedule');
  		})
  		.map(res => {
  			//console.log('res from etastpo', res);
  			let data = res.json();

  			let dataToReturn: Array<any> = [];

  			if ( data.get_stop_etas ) {
  				if ( direction ) {
  					console.log('data.get_stop_etas', data.get_stop_etas);
  					data.get_stop_etas[0].enRoute.forEach(train => {
  						console.log('train is', train, direction);
  						if ( train.direction === direction ) {
  							dataToReturn.push(train);
  						}
  					});
  				} else {
  					dataToReturn = data.get_stop_etas;
  				}

  			} else {
  				console.error('response doesnt contain data.get_stop_etas');
  			}

  			//this.data = data;
  			return dataToReturn;
  		});
  	}

  	getVihicles(stopId: number) {

  		let alerts: Array<{time: string, message: string}> = [];
  		let url: string;
  		url = "http://trirailpublic.etaspot.net/service.php";

  		let params: URLSearchParams = new URLSearchParams();
  		params.set('includeETAData', "1");
  		params.set('orderedETAArray', "1");
  		params.set('token', "TESTING");
  		params.set('service', "get_vihicles");

  		return this.http.get(url, { search: params} )
  		.catch(error => {
  			console.log('error getting schedule from etaspot', error);
  			return Observable.throw('unable to get schedule');
  		})
  		.map(res => {
  			//console.log('res from etastpo', res);
  			let data = res.json();

  			let dataToReturn: Array<any> = [];

  			if ( data.get_vihicles ) {
  				// if ( direction ) {
  					console.log('data.get_vihicles', data.get_vihicles);
  					data.get_vihicles[0].enRoute.forEach(train => {
  						console.log('train is', train);
  						// if ( train.direction === direction ) {
  						// 	dataToReturn.push(train);
  						// }
  					});
  				// } else {
  				// 	dataToReturn = data.get_vihicles;
  				// }

  			} else {
  				console.error('response doesnt contain data.get_stop_etas');
  			}

  			//this.data = data;
  			return dataToReturn;
  		});
  	}

  }
