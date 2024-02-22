import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; // Ensure this import is correct

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
