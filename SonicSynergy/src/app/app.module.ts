import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component'; // Ensure this import is correct
import { ArtistService } from './services/artist.service';
import { AlbumService } from './services/album.service';
import { SongService } from './services/song.service';

@NgModule({
  declarations: [AppComponent], // Declare AppComponent here
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    ArtistService,
    AlbumService,
    SongService
  ],
  bootstrap: [AppComponent] // Bootstrap AppComponent
})
export class AppModule { }
