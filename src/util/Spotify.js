// My app info
const client_id = 'baa48818410d44f99bd3d95317b0bfa5';
// const client_secret = 'b3f1cfed10314c7c853728edf34b3944';

// script variables
let accessToken;

// spotify links and info
const url = 'https://accounts.spotify.com/authorize?';
const redirect_uri = 'http://localhost:3000/';
const desiredUserScope = 'playlist-modify-public';
const response_type = 'token';
const api_endpoint = 'https://api.spotify.com/v1/search?type=track&q=';

const Spotify = {
    getCurrentQueryParameters () {
        const currentLocation = window.location.href;
        const params = new URLSearchParams(currentLocation);
        return params;
    },
    buildAuthLink () {
        return `${url}client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${desiredUserScope}`;
    },
    getAccessToken () {
        if (accessToken) {
            return accessToken;
        }
        const currentURL = window.location.href;
        const hasAccessToken = currentURL.match(/access_token=([^&]*)/);
        const hasExpiresIn = currentURL.match(/expires_in=([^&]*)/);
        if (hasAccessToken && hasExpiresIn) {
            accessToken = hasAccessToken[1];
            const expiresIn = Number(hasExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = Spotify.buildAuthLink();
        }
    },
    async search (term) {
        const urlToFetch = `${api_endpoint}${term}`;
        const token = Spotify.getAccessToken();
        try {
            const response = await fetch(urlToFetch, {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                if (!jsonResponse.tracks) {
                    return [];
                }
                return (jsonResponse.tracks.items.map(track => {
                    return ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    });
                }));
            }
        } catch (error) {
            console.log(error);
        }
    },
    async getUserId () {
        const token = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${token}`};
        const urlToFetch = `https://api.spotify.com/v1/me`;
        try {
            const response = await fetch(urlToFetch, {headers: headers});
            if (response.ok) {
                const userInfo = await response.json();
                const userId = userInfo.id;
                return userId;
            }
        } catch (error) {
            console.log(error);
        }
    },
    // Helper for savePlaylist
    async postPlaylist (newPlaylistName, user_id) {
        if (!newPlaylistName || !user_id) {
            return;
        }
        const token = Spotify.getAccessToken();
        const urlToFetch = `https://api.spotify.com/v1/users/${user_id}/playlists`;
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
        };
        const data = {
            name: newPlaylistName,
            description: "New playlist"
        };
        try {
            const response = await fetch(urlToFetch, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            const playlistInfo = await response.json();
            const playlistId = playlistInfo.id;
            return playlistId;
        } catch (error) {
            console.log(error);
        }
    },
    // Helper for savePlaylist
    async postTracksToPlaylist (newSongArrayUris, playlist_id) {
        if (!newSongArrayUris || !playlist_id) {
            return;
        }
        const token = Spotify.getAccessToken();
        const urlToFetch = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const data = {
            uris: newSongArrayUris
        };
        try {
            const response = await fetch(urlToFetch, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            const playlistInfo = await response.json();
            const snapshotId = playlistInfo.snapshot_id;
            return snapshotId;
        } catch (error) {
            console.log(error);
        }
    },
    async savePlaylist (name, uris) {
        if (!name || !uris) {
            return;
        }
        const id = await Spotify.getUserId();
        const playlistId = await Spotify.postPlaylist(name, id);
        const snapShotId = await Spotify.postTracksToPlaylist(uris, playlistId);
        return snapShotId;
    }
};

export default Spotify;