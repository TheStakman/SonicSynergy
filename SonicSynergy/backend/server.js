const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/SonicSynergy', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

const artistSchema = new mongoose.Schema({
  name: String,
  artistImg: String
});

const albumSchema = new mongoose.Schema({
  artistId: String,
  name: String,
  albumArt: String
});

const songSchema = new mongoose.Schema({
  albumId: String,
  name: String,
  length: Number
});

const Artist = mongoose.model('Artists', artistSchema);
const Album = mongoose.model('Albums', albumSchema);
const Song = mongoose.model('Songs', songSchema);

// retrieve artists, albums, songs
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await Artist.find();
    console.log('Retrieved artists:', artists);
    res.json(artists);
  } catch (error) {
    console.error('Error retrieving artists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/artists/:artistId/albums', async (req, res) => {
  try {
    const { artistId } = req.params;
    console.log('Received artistId:', artistId);

    const albums = await Album.find({ artistId: artistId });
    console.log('Query result:', albums);

    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/albums/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/albums/:albumId/songs', async (req, res) => {
  try {
    const songs = await Song.find({ albumId: req.params.albumId });
    res.json(songs);
  } catch (error) {
    console.error('Error retrieving songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/songs/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    console.error('Error retrieving song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/albums/:albumId/songs/:songId', async (req, res) => {
  try {
    const { albumId, songId } = req.params;
    const song = await Song.findOne({ _id: songId, albumId: albumId });

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// add artists, albums, songs
app.post('/api/artists', async (req, res) => {
  try {
    const newArtist = new Artist(req.body);
    await newArtist.save();
    res.json(newArtist);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/artists/:artistId/albums', async (req, res) => {
  try {
    const newAlbum = new Album(req.body);
    await newAlbum.save();
    res.json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/albums/:albumId/songs', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug logging
    const newSong = new Song(req.body);
    await newSong.save();
    res.json(newSong);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// edit artists, albums, songs
app.put('/api/artists/:artistId', async (req, res) => {
  try {
    const { artistId } = req.params;
    const updatedArtist = await Artist.findByIdAndUpdate(artistId, req.body, { new: true });
    res.json(updatedArtist);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/albums/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, req.body, { new: true });
    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/songs/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const updatedSong = await Song.findByIdAndUpdate(songId, req.body, { new: true });
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// delete artists, albums, songs
app.delete('/api/artists/:id', async (req, res) => {
  try {
    const artistId = req.params.id;

    // Find all albums associated with the artist
    const albums = await Album.find({ artistId: artistId });

    // Extract album IDs
    const albumIds = albums.map(album => album._id);

    // Delete all songs associated with the albums
    await Song.deleteMany({ albumId: { $in: albumIds } });

    // Delete all albums associated with the artist
    await Album.deleteMany({ artistId: artistId });

    // Delete the artist
    await Artist.findByIdAndDelete(artistId);

    res.json({ message: 'Artist and related albums and songs deleted' });
  } catch (error) {
    console.error('Error deleting artist and related data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/artists/:artistId/albums', async (req, res) => {
  try {
    const { artistId } = req.params;
    const { albumId } = req.body;

    // Ensure the album exists and belongs to the artist
    const album = await Album.findOne({ _id: albumId, artistId: artistId });
    console.log('albumId: ' + albumId + ' artistId: ' + artistId + ' album: ' + album)

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Delete all songs associated with the album
    await Song.deleteMany({ albumId: albumId });

    // Delete the album
    await Album.findByIdAndDelete(albumId);

    res.json({ message: 'Album and related songs deleted' });
  } catch (error) {
    console.error('Error deleting album and related songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/songs/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    await Song.findByIdAndDelete(songId);
    res.json({ message: 'Song deleted' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/albums/:albumId/songs/:songId', async (req, res) => {
  try {
    const { albumId, songId } = req.params;

    // Ensure the song exists and belongs to the album
    const song = await Song.findOne({ _id: songId, albumId: albumId });

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Delete the song
    await Song.findByIdAndDelete(songId);

    res.json({ message: 'Song deleted' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
