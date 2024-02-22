import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Song } from '../models/song.model';
import { SONGS } from '../data/mock-songs';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor() { }

  getSongs(albumId: number): Observable<Song[]> {
    return of(SONGS.filter(song => song.albumId === albumId));
  }
}
