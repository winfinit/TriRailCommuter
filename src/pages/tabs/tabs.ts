import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AlertsPage } from '../alerts/alerts';
import { SchedulePage } from '../schedule/schedule';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabHome: any = HomePage;
  tabAlerts: any = AlertsPage;
  tabSchedule: any = SchedulePage;

  constructor() { }

  clickTest() {
  	console.log('test');
  }

}
