import React from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = { 
      searchResults: [
        {
          id: 4,
          name: 'Radioactive',
          artist: 'Imagine Dragons',
          album: 'Night Visions',
          uri: 'spotify:track:4G8gkOterJn0Ywt6uhqbhp'
        },
        {
          id: 5,
          name: 'Wonderboy',
          artist: 'Tenacious D',
          album: 'Tenacious D',
          uri: 'spotify:track:3XPQevBxsl15mKHVsV9nrR'
        },
        {
          id: 6,
          name: 'This Is Gospel',
          artist: 'Panic! At The Disco',
          album: 'Too Weird to Live, Too Rare to Die!',
          uri: 'spotify:track:3yZQk5PC52CCmT4ZaTIKvv'
        }
      ],
      playlistName: 'Bananas',
      playlistTracks: [
        {
          id: 1,
          name: 'Indestructible',
          artist: 'Disturbed',
          album: 'Indestructible',
          uri: 'spotify:track:42ZVk59gT4tMlrZmd8Ijxf'
        },
        {
          id: 2,
          name: 'Ten Thousand Fists',
          artist: 'Disturbed',
          album: 'Ten Thousand Fists',
          uri: 'spotify:track:5hkgrWxkobGtg30I7DsfVu'
        },
        {
          id: 3,
          name: 'High Hopes',
          artist: 'Panic! At The Disco',
          album: 'Pray for the Wicked',
          uri: 'spotify:track:1rqqCSm0Qe4I9rUvWncaom'
        }
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack (track) {
    let newPlaylist = this.state.playlistTracks;
    if (newPlaylist.find(savedTrack => savedTrack.id === track.id)) {
      // do nothing
    } else {
      newPlaylist.push(track);
      this.setState({ playlistTracks: newPlaylist });
    }
  }

  removeTrack (track) {
    let newPlaylist = this.state.playlistTracks;
    let trackIndex = newPlaylist.indexOf(track);
    if (trackIndex >= 0) {
      newPlaylist.splice(trackIndex, 1);
      this.setState({ playlistTracks: newPlaylist });
    }
  }

  updatePlaylistName (newName) {
    if (newName) {
      this.setState({ playlistName: newName });
    }
  }

  async savePlaylist () {
    const currentPlaylistName = this.state.playlistName;
    const playlistURIs = this.state.playlistTracks.map(track => track.uri);
    if (playlistURIs.length < 1) {
      console.log("Cannot submit empty playlist.");
      return;
    }
    const snapShotId = await Spotify.savePlaylist(currentPlaylistName, playlistURIs);
    if (snapShotId) {
      this.setState({ playlistName: 'New Playlist', playlistTracks: [] });
      console.log(snapShotId);
    } else {
      console.log('Spotify request did not post.');
    }
  }

  async search (term) {
    const searchResults = await Spotify.search(term);
    let finalizedDisplayResults = [];
    for (let track of searchResults) {
      let isInPlaylist = false;
      for (let plTrack of this.state.playlistTracks) {
        if (track.uri === plTrack.uri) {
          isInPlaylist = true;
        }
      }
      if (!isInPlaylist) {
        finalizedDisplayResults.push(track);
      }
    }
    this.setState({ searchResults: finalizedDisplayResults });
  }

  render () {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks} 
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName} 
                      onSave={this.savePlaylist} 
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
