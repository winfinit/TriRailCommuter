import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AlertsPage } from '../pages/alerts/alerts';
import { HomePage } from '../pages/home/home';
import { SchedulePage } from '../pages/schedule/schedule';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';

export function provideStorage() {
  return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' });
}

@NgModule({
  declarations: [
    MyApp,
    AlertsPage,
    SchedulePage,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AlertsPage,
    SchedulePage,
    HomePage,
    TabsPage
  ],
  providers: [
    { provide: Storage, useFactory: provideStorage }, 
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
