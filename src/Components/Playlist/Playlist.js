import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
    constructor (props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleNameChange (e) {
        const newValue = e.target.value;
        this.props.onNameChange(newValue);
    }

    handleClick () {
        this.props.onSave();
    }

    render () {
        return (
            <div className="Playlist">
                <input defaultValue={this.props.playlistName} onChange={this.handleNameChange} />
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
                <button className="Playlist-save" onClick={this.handleClick} >SAVE TO SPOTIFY</button>
            </div>
        );        
    }
}

export default Playlist;