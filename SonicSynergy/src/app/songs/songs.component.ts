import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from '../models/song.model';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  standalone: true
})
export class SongsComponent implements OnInit {
  songs: Song[] = [];

  constructor(
    private songService: SongService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs(): void {
    const albumIdParam = this.route.snapshot.paramMap.get('albumId');
    if (albumIdParam !== null) {
      const albumId = +albumIdParam;
      this.songService.getSongs(albumId)
        .subscribe(songs => this.songs = songs);
    } else {
      // Handle the case where 'albumId' parameter is not present
      console.error("Album ID parameter is missing.");
    }
  }  
}
