import { Component, OnInit } from '@angular/core';
import { Artist } from '../models/artist.model';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  newArtist: Artist = { name: '', artistImg: '' };
  selectedArtist: Artist = { _id: '', name: '', artistImg: '' };
  showAddArtistForm = false;
  showEditArtistForm = false;
  showDeleteConfirm = false;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    // load artists
    this.dataService.getArtists().subscribe(data => {
      this.artists = data.sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  // add artist to collection
  addArtist(): void {
    this.dataService.addArtist(this.newArtist).subscribe(artist => {
      this.artists.push(artist);
      this.newArtist = { name: '', artistImg: '' };
      this.showAddArtistForm = false;
    })
  }

  // close add form
  cancelAdd(): void {
    this.showAddArtistForm = false;
  }

  // reveal edit form
  showEditForm(artist: Artist): void {
    this.selectedArtist = { ...artist };
    this.showEditArtistForm = true;
  }

  // edit existing artist details
  editArtist(): void {
    this.dataService.editArtist(this.selectedArtist).subscribe(updatedArtist => {
      const index = this.artists.findIndex(artist => artist._id === updatedArtist._id);
      if (index !== -1) {
        this.artists[index] = updatedArtist;
        this.artists.sort((a, b) => a.name.localeCompare(b.name));
      }
      this.showEditArtistForm = false;
    });
  }

  // close edit form
  cancelEdit(): void {
    this.showEditArtistForm = false;
  }

  // reveal delete confirmation
  confirmDelete(artist: Artist): void {
    this.selectedArtist = artist;
    this.showDeleteConfirm = true;
  }

  // close delete confirmation
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  // delete artist and their albums and songs from collection
  deleteArtist(): void {
    if (this.selectedArtist._id) {
      this.dataService.deleteArtist(this.selectedArtist._id).subscribe(() => {
        this.artists = this.artists.filter(artist => artist._id !== this.selectedArtist._id);
        this.showDeleteConfirm = false;
      });
    } else {
      console.error('Artist ID is undefined');
    }
  }

  // navigate to artist's albums
  navigateToAlbums(artistId: string | undefined): void {
    this.router.navigate(['/artist', artistId, 'albums']);
  }
}
