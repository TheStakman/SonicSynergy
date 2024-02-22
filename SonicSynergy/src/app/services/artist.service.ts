import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Artist } from '../models/artist.model';
import { ARTISTS } from '../data/mock-artists';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor() { }

  getArtists(): Observable<Artist[]> {
    return of(ARTISTS);
  }
}
