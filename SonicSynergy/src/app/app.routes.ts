import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsComponent } from './artists/artists.component';
import { AlbumsComponent } from './albums/albums.component';
import { SongsComponent } from './songs/songs.component';

const routes: Routes = [
    { path: '', component: ArtistsComponent },
    { path: 'artist/:id/albums', component: AlbumsComponent },
    { path: 'albums/:id/songs', component: SongsComponent }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }