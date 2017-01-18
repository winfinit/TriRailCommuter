import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the AlertsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/

  @Injectable()
  export class AlertsService {

  	constructor(public http: Http) {
  		console.log('Hello AlertsService Provider');
  	}



  load() {

          let alerts: Array<{time: string, message: string}> = [];
          let url: string;
          url = "http://www.tri-rail.com/vip.mobile/mobile_vip_message.asp";

          return this.http.get(url)
          .catch(error => {
            console.log('error getting alerts', error);
            return Observable.throw('unable to get alerts');
          })
          .map(res => {
            let data = res.text();
            var parser = new DOMParser();
            let doc = parser.parseFromString(data, "text/html");
            let testAnchors = doc.getElementsByTagName('table')[0];
            console.log(testAnchors);
            let cells: any[] = Array.prototype.slice.call(testAnchors.querySelectorAll("td"));
            cells.forEach(function(row, index) {
              //console.log(row);
              let content = row.innerHTML;
              //console.log(content);
              let time = content.match(/(\d?\d:\d\d:\d\d\s+[AP]M)/);
              //console.log(time[0]);
              let message = row.getElementsByTagName('strong')[0].innerHTML;
              //console.log(message);
              alerts.push({
                time: time[0],
                message: message
              })
            });

            //this.data = data;
            return alerts;
          });
      }
    

  }
