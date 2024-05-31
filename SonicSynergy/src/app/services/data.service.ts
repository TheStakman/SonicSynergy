import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, of, switchMap } from 'rxjs';
import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // retrieve artists, albums, songs
  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/artists`);
  }

  getArtistById(artistId: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/artists/${artistId}`);
  }

  getAlbums(artistId: string): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/artists/${artistId}/albums`);
  }

  getSongs(albumId: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/albums/${albumId}/songs`);
  }  

  getArtist(artistId: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/artists/${artistId}`);
  }

  getAlbumById(albumId: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/albums/${albumId}`);
  }

  getSongById(albumId: string, songId: string): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/albums/${albumId}/songs/${songId}`);
  }

  // add artist, albums, songs
  addArtist(artist: Artist): Observable<Artist> {
    return this.http.post<Artist>(`${this.apiUrl}/artists`, artist);
  }  

  addAlbum(artistId: string, album: Album): Observable<Album> {
    return this.http.post<Album>(`${this.apiUrl}/artists/${artistId}/albums`, album);
  }  

  addSong(albumId: string, song: Song): Observable<Song> {
    console.log('API URL:', `${this.apiUrl}/albums/${albumId}/songs`); // Debug logging
    console.log('Song to be sent:', song); // Debug logging
    return this.http.post<Song>(`${this.apiUrl}/albums/${albumId}/songs`, song);
  }

  // edit artists, albums, songs
  editArtist(artist: Artist): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/artists/${artist._id}`, artist);
  }

  editAlbum(album: Album): Observable<Album> {
    return this.http.put<Album>(`${this.apiUrl}/albums/${album._id}`, album);
  }

  editSong(song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/songs/${song._id}`, song);
  }

  // delete artists, albums, songs
  deleteArtist(artistId: string): Observable<Artist> {
    return this.http.delete<Artist>(`${this.apiUrl}/artists/${artistId}`);
  }

  deleteAlbumAndSongs(artistId: string, albumId: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/artists/${artistId}/albums`, { body: { albumId } });
  }
  

  deleteSong(albumId: string, songId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/albums/${albumId}/songs/${songId}`);
  }
}
