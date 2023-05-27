const Joi = require('joi');

const PlaylistSongActivityPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
  userId: Joi.string().required(),
  action: Joi.string().required(),
  time: Joi.date().timestamp().required(),
});

module.exports = { PlaylistSongActivityPayloadSchema };
