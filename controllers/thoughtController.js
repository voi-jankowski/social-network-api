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
    const thought = await Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v");
  },
};
