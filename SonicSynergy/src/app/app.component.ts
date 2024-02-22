import { Component } from '@angular/core';
import { Artist } from './models/artist.model';
import { Album } from './models/album.model';
import { Song } from './models/song.model';
import { ArtistService } from './services/artist.service';
import { AlbumService } from './services/album.service';
import { SongService } from './services/song.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent {
  artists: Artist[] = [];
  albums: Album[] = [];
  songs: Song[] = [];
  selectedArtist: Artist | undefined = new Artist;
  selectedAlbum: Album | undefined = new Album;
  showAlbums: boolean = false;
  showSongs: boolean = false;

  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService,
    private songService: SongService
  ) {}

  ngOnInit() {
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
}
