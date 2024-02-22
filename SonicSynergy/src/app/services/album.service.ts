import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Album } from '../models/album.model';
import { ALBUMS } from '../data/mock-albums';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor() { }

  getAlbums(artistId: number): Observable<Album[]> {
    return of(ALBUMS.filter(album => album.artistId === artistId));
  }
}
