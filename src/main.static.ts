import { bootstrapApplication } from '@angular/platform-browser';
import { appConfigStatic } from './app/app.config.static';
import { App } from './app/app';

bootstrapApplication(App, appConfigStatic).catch((err) => console.error(err));