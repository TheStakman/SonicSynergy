import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { ArtistService } from './services/artist.service';
import { AlbumService } from './services/album.service';
import { SongService } from './services/song.service';

@NgModule({
  imports: [
    BrowserModule,
    AppComponent,
    CommonModule
  ],
  providers: [ArtistService, AlbumService, SongService],
//   bootstrap: [AppComponent]
})
export class AppModule { }
