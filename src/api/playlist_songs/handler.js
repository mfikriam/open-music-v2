const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayloadSchema(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const playlistSongId = await this._playlistSongsService.addPlaylistSong({
      playlistId,
      songId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam Playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);

    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistsById(playlistId, credentialId);
    const songs = await this._playlistSongsService.getPlaylistSongsByPlaylistId(playlistId);
    playlist.songs = songs;

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }
}

module.exports = PlaylistSongsHandler;
