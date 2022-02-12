const { model, Schema } = require("mongoose");

const lyric_schema = new Schema({
  artist: {
    type: String,
    required: true,
  },
  song_name: {
    type: String,
    required: true,
  },
  lyrics: {
    type: Array,
    required: true,
  },
  post_by: {
    type: String,
    required: true,
  },
});

const Lyric = model("lyric", lyric_schema);

module.exports = Lyric;
