import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from '../models/song.model';
import { CommonModule, NgFor } from '@angular/common';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  standalone: true,
  imports: [
    NgFor,
    CommonModule,
    FormsModule
  ]
})
export class SongsComponent implements OnInit {
  songs: Song[] = [];
  newSong: Song = { name: '', albumId: '', length: 0 };
  selectedSong: Song = { _id: '', name: '', albumId: '', length: 0 };
  selectedAlbumId: string | undefined;
  showAddSongForm = false;
  showEditSongForm = false;
  showDeleteConfirmation = false;

  constructor(private dataService: DataService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    // subscribe to route params to get selected albumId
    this.route.params.subscribe(params => {
      this.selectedAlbumId = params['id'];
      this.loadSongs(this.selectedAlbumId as string);
    });
  }

  // load album's songs
  loadSongs(albumId: string): void {
    this.dataService.getSongs(albumId).subscribe(data => {
      this.songs = data;
    }, error => {
      console.error('Error loading songs:', error);
    });
  }

  // format song length to minutes:seconds
  formatSongLength(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // navigate back to albums list
  backToAlbums(): void {
    window.history.back();
  }

  // add song to album
  addSong(): void {
    this.newSong.albumId = this.selectedAlbumId as string;
    console.log('Adding song with albumId:', this.newSong.albumId);
    console.log('New Song:', this.newSong);

    this.dataService.addSong(this.selectedAlbumId as string, this.newSong).subscribe(
      (song) => {
        console.log('Song saved successfully:', song);
        this.songs.push(song);
        this.newSong = { albumId: this.selectedAlbumId as string, name: '', length: 0 };
        this.showAddSongForm = false;
      },
      (error) => {
        console.error('Error saving song:', error);
      }
    );
  }

  // reveal edit form
  showEditForm(song: Song): void {
    this.selectedSong = { ...song };
    this.showEditSongForm = true;
  }

  // edit existing song details
  editSong(): void {
    this.dataService.editSong(this.selectedSong).subscribe(updatedSong => {
      const index = this.songs.findIndex(song => song._id === updatedSong._id);
      if (index !== -1) {
        this.songs[index] = updatedSong;
      }
      this.showEditSongForm = false;
    });
  }

  // close edit form
  cancelEdit(): void {
    this.showEditSongForm = false;
  }

  // close add form
  cancelAdd(): void {
    this.showAddSongForm = false;
  }

  // reveal delete confirmation
  confirmDelete(song: Song): void {
    this.selectedSong = song;
    this.showDeleteConfirmation = true;
  }

  // delete song from album
  deleteSong(): void {
    if (this.selectedSong._id && this.selectedAlbumId) {
      this.dataService.deleteSong(this.selectedAlbumId, this.selectedSong._id).subscribe(() => {
        this.songs = this.songs.filter(song => song._id !== this.selectedSong._id);
        this.showDeleteConfirmation = false;
        this.selectedSong = { _id: '', name: '', albumId: '', length: 0 };
      }, error => {
        console.error('Error deleting song:', error);
      });
    }
  }

  // close delete confirmation
  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

}
