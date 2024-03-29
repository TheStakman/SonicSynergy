import { Component } from '@angular/core';
import { Artist } from './models/artist.model';
import { Album } from './models/album.model';
import { Song } from './models/song.model';
import { ArtistService } from './services/artist.service';
import { AlbumService } from './services/album.service';
import { SongService } from './services/song.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // standalone: true,
  // imports: [CommonModule],
})
export class AppComponent {
  artists: Artist[] = [];
  albums: Album[] = [];
  songs: Song[] = [];
  selectedArtist: Artist | undefined = new Artist;
  selectedAlbum: Album | undefined = new Album;
  showAlbums: boolean = false;
  showSongs: boolean = false;
  standalone: boolean = true;
  showName: boolean = false;

  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService,
    private songService: SongService,
    private location: Location
  ) {}

  ngOnInit() {
    console.log('AppComponent initialized');
    this.loadArtists();
  }

  loadArtists() {
    this.artistService.getArtists()
      .subscribe(artists => this.artists = artists);
  }

  showAlbumsForArtist(artistId: number) {
    this.albumService.getAlbums(artistId)
      .subscribe(albums => {
        this.albums = albums;
        this.selectedArtist = this.artists.find(artist => artist.id === artistId);
        this.showAlbums = true;
        this.showSongs = false;
      });
  }

  showSongsForAlbum(albumId: number) {
    this.songService.getSongs(albumId)
      .subscribe(songs => {
        this.songs = songs;
        this.selectedAlbum = this.albums.find(album => album.id === albumId);
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
