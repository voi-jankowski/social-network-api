const { Schema, Types } = require("mongoose");

const reactionSchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment's _id field
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      // must be  280 characters max
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    // use moment.js to format the date on query
    createdAt: {
      type: Date,
      default: Date.now,
      // use a getter method to format the timestamp on query
      get: (timestamp) => timestamp.toTimeString(),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

module.exports = reactionSchema;
