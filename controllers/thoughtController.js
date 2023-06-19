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
    } catch (err) {
      res.status(404).json({ message: "There is no thought with this id!" });
    }
  },
  //   POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
  async createThought({ body }, res) {
    try {
      const thought = await Thought.create(body);

      await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
