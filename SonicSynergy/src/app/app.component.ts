import { Component } from '@angular/core';
import { Artist } from './models/artist.model';
import { Album } from './models/album.model';
import { Song } from './models/song.model';
import { Location } from '@angular/common';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  artists: Artist[] = [];
  albums: Album[] = [];
  songs: Song[] = [];
  selectedArtist: Artist | undefined;
  selectedAlbum: Album | undefined;
  showAlbums: boolean = false;
  showSongs: boolean = false;
  standalone: boolean = true;
  showName: boolean = false;

  constructor(
    private dataService: DataService,
    private location: Location
  ) {}

  ngOnInit() {
    console.log('AppComponent initialized');
    this.loadArtists();
  }

  loadArtists() {
    this.dataService.getArtists()
      .subscribe(artists => this.artists = artists);
  }

  showAlbumsForArtist(artistId: string) {
    this.dataService.getAlbums(artistId)
      .subscribe(albums => {
        this.albums = albums;
        this.selectedArtist = this.artists.find(artist => artist._id === artistId);
        this.showAlbums = true;
        this.showSongs = false;
      });
  }

  showSongsForAlbum(albumId: string) {
    this.dataService.getSongs(albumId)
      .subscribe(songs => {
        this.songs = songs;
        this.selectedAlbum = this.albums.find(album => album._id === albumId);
        this.showSongs = true;
      });
  }

  goBack(): void {
    if (this.showSongs) {
      // If currently showing songs, go back to showing albums
      this.showSongs = false;
      this.showAlbums = true;
    } else if (this.showAlbums) {
      // If currently showing albums, go back to showing artists
      this.showAlbums = false;
    } else {
      // If no other section is active, navigate back using the Location service
      this.location.back();
    }
  }

  // Formats the time length turning seconds into minutes and seconds.
  formatSongLength(seconds: number): string {
    const minutes = Math.floor(seconds /  60);
    const remainingSeconds = seconds %  60;
    // Conditionally format minutes to drop leading zero
    const formattedMinutes = minutes <  10 ? minutes : minutes.toString().padStart(2, '0');
    return `${formattedMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
    
}
