import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Album } from '../models/album.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ]
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  newAlbum: Album = { name: '', artistId: '', albumArt: '' };
  selectedAlbum: Album = { _id: '', name: '', artistId: '', albumArt: '' };
  selectedArtistId: string | undefined;
  showAddAlbumForm = false;
  showEditAlbumForm = false;
  showDeleteConfirmation = false;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // subscribe to route params to get selected artistId
    this.route.params.subscribe(params => {
      this.selectedArtistId = params['id'];
      this.loadAlbums(this.selectedArtistId as string);
    });
  }

  // load artist's albums
  loadAlbums(artistId: string): void {
    this.dataService.getAlbums(artistId).subscribe(data => {
      this.albums = data.sort((a, b) => a.name.localeCompare(b.name));
    }, error => {
      console.error('Error loading albums:', error);
    });
  }

  // navigate to songs for selected album
  navigateToSongs(albumId: string | undefined): void {
    this.router.navigate(['/albums', albumId, 'songs']);
  }

  // add album to artist's collection
  addAlbum(): void {
    this.newAlbum.artistId = this.selectedArtistId as string; // Ensure artistId is set before sending
    this.dataService.addAlbum(this.selectedArtistId as string, this.newAlbum).subscribe(
      (album) => {
        this.albums.push(album);
        this.albums.sort((a, b) => a.name.localeCompare(b.name));
        this.newAlbum = { artistId: this.selectedArtistId as string, name: '', albumArt: '' };
        this.showAddAlbumForm = false;
      },
      (error) => {
        console.error('Error saving album:', error);
      }
    );
  }

  // close add form
  cancelAdd(): void {
    this.showAddAlbumForm = false;
  }

  // reveal edit form
  showEditForm(album: Album): void {
    this.selectedAlbum = { ...album };
    this.showEditAlbumForm = true;
  }

  // edit existing album details
  editAlbum(): void {
    this.dataService.editAlbum(this.selectedAlbum).subscribe(updatedAlbum => {
      const index = this.albums.findIndex(album => album._id === updatedAlbum._id);
      if (index !== -1) {
        this.albums[index] = updatedAlbum;
        this.albums.sort((a, b) => a.name.localeCompare(b.name));
      }
      this.showEditAlbumForm = false;
    });
  }

  // close edit form
  cancelEdit(): void {
    this.showEditAlbumForm = false;
  }

  // reveal delete confirmation
  confirmDelete(album: Album): void {
    this.selectedAlbum = album;
    this.showDeleteConfirmation = true;
  }

  // delete album from artist's collection, delete songs associated with album
  deleteAlbum(): void {
    if (this.selectedAlbum._id && this.selectedArtistId) {
      this.dataService.deleteAlbumAndSongs(this.selectedArtistId, this.selectedAlbum._id).subscribe(() => {
        this.albums = this.albums.filter(album => album._id !== this.selectedAlbum._id);
        this.showDeleteConfirmation = false;
        this.selectedAlbum = { _id: '', name: '', artistId: '', albumArt: '' };
      }, error => {
        console.error('Error deleting album:', error);
      });
    }
  }

  // close delete confirmation
  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  // get album details by id
  getAlbum(albumId: string): void {
    this.dataService.getAlbumById(albumId).subscribe(album => {
      console.log(album);
    }, error => {
      console.error('Error fetching album:', error);
    });
  }
}
