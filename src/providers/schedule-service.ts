import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers, QueryEncoder } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable }     from 'rxjs/Observable';

class MyQueryEncoder extends QueryEncoder {
	encodeKey(k: string): string {
		return k;
	}

	encodeValue(v: string): string {
		let newV = v.replace(/[+]/g, '%2B');
		return newV;
	}
}

interface ScheduleRequestObj {
	scheduleDay: string;
	fromStation: string;
	toStation: string;
}

/*
  Generated class for the ScheduleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/
  @Injectable()
  export class ScheduleService {

  	constructor(public http: Http) {
  		console.log('Hello ScheduleService Provider');
  	}
  	load(scheduleObj: ScheduleRequestObj) {

  		// We're using Angular HTTP provider to request the data,
  		// then on the response, it'll map the JSON data to a parsed JS object.
  		// Next, we process the data and resolve the promise with the new data.
  		let url: string;
  		url = "http://www.tri-rail.com/train-schedules/TrainSchedule.aspx";
  		//url = "/train-schedules/TrainSchedule.aspx";
  		//console.log(scheduleObj);
      console.log("schedule obj", scheduleObj);
  		let ddlDep: string = scheduleObj.fromStation;
  		let ddlArr: string = scheduleObj.toStation;
  		let ddlDot: string;
  		if ( scheduleObj.scheduleDay === 'Weekday' ) {
  			ddlDot = "1";
  		} else {
  			ddlDot = "2";
  		}

  		console.log('params translated', ddlDep, ddlArr, ddlDot);

  		let params: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
  		params.set('ddlDep', ddlDep);
  		params.set('ddlArr', ddlArr);
  		params.set('ddlDot', ddlDot);
  		params.set('Button1', "Show Schedule");
  		params.set('__EVENTVALIDATION', "/wEdACu4Nh74Q97twO+hJb+Dksy9mQePPiMNTQlWf6NjVMXsW6Yob9Gwxm0pxZ0KYtRudvkNp6SmHZuwb7zU66mXZLqBBzmFJO11rgSPGURRg+NxhdcLvUSOwGrwJK/MMy9MqV3/bF0jKI5507FcyDDcT1X7AYnTyyuHGvDzEPxAc5JLtGhQKxnpfMfO+p3RnnSH7L1k3lTMs5wKAZMQbfk0+YzBhzDx0V0b9TOUHSpeFLrqTBoQJvcNlnJgxPFWtaXYesPiLJYpSEknvPP7/u1z1LTdfM53h5zdCYhPoo2FbY014E2rtwjSJZBZ42PCcS1kBnz/0Zkm5CUghN7NMGjpAUVfXAxslO5JTEakGiO1KdAqtdLRGWYAU09quNxCoOiEDzzHPZFsyCkDWlDBUomhTrVH3dCzvLZi4wsbrw97+x6jZ84xP8sWZN9T8n7TjkoqygLVGRlp9rjyOD0vEsUznBkCJPb4QsU4P7WXn7regLC/aN6+udPw9FGQk4UyZr26hhWxV3worYFHMhw5v3/uJ2o5K9smAQ/TBdt+jwPqxavOln8xmxt3BDbQbIaDO+H8ZEZVFchGLcWF8D//EZaKrJLj583ADmEmErRBVJmZFIW5U5rn+0xtddI9IuN1aILIHHXSP2vUtW43ENQiCgAEGjDLfzJK/lGQwlPQc2B3BtkhqiIHvuLwREgzDsRTKFQrJAL1QlrIp/w/TVW2PXpk5YYX0s7iRDoL4EPNirnTZFp0f5Hui6ewcOUbpjWfeRwQbokkV9mZrBYUoS8Q6Vykw0AbX1iek5XjmDo/go5DvOgX8KupQli2Ose5fci+Y8m0LDug4l+A9R8OjKSb7nYTWFyc4DwbvBYkVypwjcwNqLW8yU3XLxkZd8+xkVl3mmsslc/N+DvxnwFeFeJ9MIBWR6936YEX6Vu0y6HAS9P1mqfD5usXI9ZYPRkmMXybKkujbuc=");
  		params.set('__VIEWSTATEGENERATOR', "DC632EE1");
  		params.set('__VIEWSTATE', "/wEPDwUHNjUyMzQ0NA9kFgICAw9kFggCAQ8QZA8WE2YCAQICAgMCBAIFAgYCBwIIAgkCCgILAgwCDQIOAg8CEAIRAhIWExAFGENob29zZSBEZXBhcnR1cmUgU3RhdGlvbgUBMGcQBQ1NYW5nb25pYSBQYXJrBQIxOGcQBQ9XZXN0IFBhbG0gQmVhY2gFAjE3ZxAFCkxha2UgV29ydGgFAjE2ZxAFDUJveW50b24gQmVhY2gFAjE1ZxAFDERlbHJheSBCZWFjaAUCMTRnEAUKQm9jYSBSYXRvbgUCMTNnEAUPRGVlcmZpZWxkIEJlYWNoBQIxMmcQBQ1Qb21wYW5vIEJlYWNoBQIxMWcQBQ1DeXByZXNzIENyZWVrBQIxMGcQBQ5GdC4gTGF1ZGVyZGFsZQUBOWcQBRZGdC4gTGF1ZGVyZGFsZSBBaXJwb3J0BQE4ZxAFD1NoZXJpZGFuIFN0cmVldAUBN2cQBRBIb2xseXdvb2QgU3RyZWV0BQE2ZxAFDUdvbGRlbiBHbGFkZXMFATVnEAUJT3BhLUxvY2thBQE0ZxAFEk1ldHJvcmFpbCBUcmFuc2ZlcgUBM2cQBQ5IaWFsZWFoIE1hcmtldAUBMmcQBQ1NaWFtaSBBaXJwb3J0BQExZ2RkAgMPEGQPFhNmAgECAgIDAgQCBQIGAgcCCAIJAgoCCwIMAg0CDgIPAhACEQISFhMQBRZDaG9vc2UgQXJyaXZhbCBTdGF0aW9uBQEwZxAFDU1hbmdvbmlhIFBhcmsFAjE4ZxAFD1dlc3QgUGFsbSBCZWFjaAUCMTdnEAUKTGFrZSBXb3J0aAUCMTZnEAUNQm95bnRvbiBCZWFjaAUCMTVnEAUMRGVscmF5IEJlYWNoBQIxNGcQBQpCb2NhIFJhdG9uBQIxM2cQBQ9EZWVyZmllbGQgQmVhY2gFAjEyZxAFDVBvbXBhbm8gQmVhY2gFAjExZxAFDUN5cHJlc3MgQ3JlZWsFAjEwZxAFDkZ0LiBMYXVkZXJkYWxlBQE5ZxAFFkZ0LiBMYXVkZXJkYWxlIEFpcnBvcnQFAThnEAUPU2hlcmlkYW4gU3RyZWV0BQE3ZxAFEEhvbGx5d29vZCBTdHJlZXQFATZnEAUNR29sZGVuIEdsYWRlcwUBNWcQBQlPcGEtTG9ja2EFATRnEAUSTWV0cm9yYWlsIFRyYW5zZmVyBQEzZxAFDkhpYWxlYWggTWFya2V0BQEyZxAFDU1pYW1pIEFpcnBvcnQFATFnZGQCBQ8QZA8WA2YCAQICFgMQBRRDaG9vc2UgRGF5IG9mIFRyYXZlbAUBMGcQBQdXZWVrZGF5BQExZxAFD1dlZWtlbmQvSG9saWRheQUBMmdkZAIJDzwrABECAA8WBB4LXyFEYXRhQm91bmRnHgtfIUl0ZW1Db3VudGZkDBQrAAMWCB4ETmFtZQUFVHJhaW4eCklzUmVhZE9ubHloHgRUeXBlGSsCHglEYXRhRmllbGQFBVRyYWluFggfAgUJRGVwYXJ0dXJlHwNoHwQZKwIfBQUJRGVwYXJ0dXJlFggfAgUHQXJyaXZhbB8DaB8EGSsCHwUFB0Fycml2YWxkGAEFCUdyaWRWaWV3MQ88KwAMAQhmZFLFi2AAEQS7ISzhr6FolkegAFyzOpcFHNeCCcvqlPRy");

  		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  		let options = new RequestOptions({ 'headers': headers });

  		return this.http.post(url, params, options)
  		.catch(error => {
  			console.log('error making post request', error);
  			//reject('error making post request');
  			return Observable.throw('unable to get schedule');
  		})
  		.map(res => {
  			let data = res.text();
  			console.log('i am here?');
  			// we've got back the raw data, now generate the core schedule data
  			// and save the data for later reference
  			var parser = new DOMParser();
  			//console.log('before parse from string', data);
  			let doc = parser.parseFromString(data, "text/html");
  			let testAnchors = doc.getElementById('GridView1');
  			let cells: any[] = Array.prototype.slice.call(testAnchors.querySelectorAll("td"));
  			var schedule = [];
  			cells.forEach(function(row, index) {
  				switch(index % 3) {
  					case 0:
  					schedule.push({
  						train: row.firstChild.data
  					});
  					break;
  					case 1:
  					schedule.slice(-1)[0].departure = row.firstChild.data;
  					break;
  					case 2:
  					schedule.slice(-1)[0].arrival = row.firstChild.data;
  					break;
  					default:
  					console.log('wtf?')
  				}
  			});

  			//this.data = data;
  			return schedule;
  			//resolve(schedule);
  		});
  	}
  }
