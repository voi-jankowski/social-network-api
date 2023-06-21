const { User, Thought } = require("../models");

module.exports = {
  // GET to get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch {
      res.status(500).json(err);
    }
  },
  //   GET to get a single thought by its _id
  async getThoughtById({ params }, res) {
    try {
      const thought = await Thought.findOne({ _id: params.id })
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");
      console.log(thought);
      if (!thought) {
        res.status(404).json({ message: "There is no thought with this id!" });
        return;
      }
      res.json(thought);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid thought ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  //   POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
  async createThought({ body }, res) {
    try {
      const thought = await Thought.create(body);

      await User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   PUT to update a thought by its _id
  async updateThought({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.id },
        { $set: body },
        { new: true, runValidators: true }
      );
      if (!thought) {
        res.status(404).json({ message: "There is no thought with this id!" });
        return;
      }
      res.json(thought);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid thought ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  //   DELETE to remove a thought by its _id
  async deleteThought({ params }, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: params.id });
      if (!thought) {
        res.status(404).json({ message: "There is no thought with this id!" });
        return;
      }
      res.json({ message: "Thought deleted!" });
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid thought ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  //   POST to create a reaction stored in a single thought's reactions array field
  async addReaction({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );
      if (!thought) {
        res.status(404).json({ message: "There is no thought with this id!" });
        return;
      }
      res.json(thought);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid thought ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  //   DELETE to pull and remove a reaction by the reaction's reactionId value
  async deleteReaction({ params }, res) {
    try {
      const thoughtId = params.thoughtId;
      const reactionId = params.reactionId;

      // Find thought by id
      const thought = await Thought.findOne({ _id: thoughtId });

      console.log("Thought:", thought);

      if (!thought) {
        res.status(404).json({ message: "There is no thought with this id!" });
        return;
      }

      const thoughtUpdated = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { reactionId: reactionId } } },
        { new: true }
      );
      res.json(thoughtUpdated);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid thought ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
};
