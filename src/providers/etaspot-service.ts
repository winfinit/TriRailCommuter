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

  	getVehicles() {

  		let url: string;
  		url = "http://trirailpublic.etaspot.net/service.php";

  		let params: URLSearchParams = new URLSearchParams();
  		params.set('includeETAData', "1");
  		params.set('orderedETAArray', "1");
  		params.set('token', "TESTING");
  		params.set('service', "get_vehicles");

  		return this.http.get(url, { search: params} )
  		.catch(error => {
  			console.log('error getting vehicles from etaspot', error);
  			return Observable.throw('unable to get vehicles');
  		})
  		.map(res => {
  			//console.log('res from etastpo', res);
  			let data = res.json();

  			let dataToReturn: Array<any> = [];

  			if ( data.get_vehicles ) {
          console.log('data.get_vehicles', data.get_vehicles);
          dataToReturn = data.get_vehicles[0].enRoute;

          data.get_vehicles[0].enRoute.forEach(train => {
            console.log('train is', train);
          });


        } else {
          console.error('response doesnt contain data.get_vihicles');
        }

        //this.data = data;
        return dataToReturn;
      });
  	}

  	getStations() {

  		let url: string;
  		url = "http://trirailpublic.etaspot.net/service.php";

  		let params: URLSearchParams = new URLSearchParams();
  		params.set('token', "TESTING");
  		params.set('service', "get_stops");

  		return this.http.get(url, { search: params} )
  		.catch(error => {
  			console.log('error getting schedule from etaspot', error);
  			return Observable.throw('unable to get stops');
  		})
  		.map(res => {
  			let data = res.json();
  			let dataToReturn: Array<any> = [];

  			if ( data.get_stops ) {
  				data.get_stops.forEach(stop => {
  					stop.triId = 19 - stop.id; 
  				});
  				dataToReturn = data.get_stops;
  			} else {
  				console.error('response doesnt contain data.get_stops');
  			}

  			//this.data = data;
  			return dataToReturn;
  		});
  	}



  }
