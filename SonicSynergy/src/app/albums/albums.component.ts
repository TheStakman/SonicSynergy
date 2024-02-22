import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../models/album.model';
import { AlbumService } from '../services/album.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  standalone: true,

  imports: [
    CommonModule
  ]
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];

  constructor(
    private albumService: AlbumService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAlbums();
  }

  getAlbums(): void {
    const artistIdParam = this.route.snapshot.paramMap.get('artistId');
    if (artistIdParam !== null) {
      const artistId = +artistIdParam;
      this.albumService.getAlbums(artistId)
        .subscribe(albums => this.albums = albums);
    } else {
      // Handle the case where 'artistId' parameter is not present
      console.error("Artist ID parameter is missing.");
    }
  }
  
}
