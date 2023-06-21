const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Get a single user by its _id and populated thought and friend data
  async getUserById({ params }, res) {
    try {
      const user = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");

      if (!user) {
        res.status(404).json({ message: "There is no user with this id!" });
        return;
      }
      res.json(user);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid user ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  // Post a new user
  async createUser({ body }, res) {
    try {
      const user = await User.create(body);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // PUT to update a user by its _id
  async updateUser({ params, body }, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.id },
        { $set: body },
        { new: true, runValidators: true }
      );
      if (!user) {
        res.status(404).json({ message: "There is no user with this id!" });
        return;
      }
      res.json(user);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid user ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  // DELETE to remove user by its _id and remove the user's associated thoughts
  async deleteUser({ params }, res) {
    try {
      const user = await User.findOneAndDelete({ _id: params.id });
      if (!user) {
        res.status(404).json({ message: "There is no user with this id!" });
        return;
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid user ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  // POST to add a new friend to a user's friend list
  async addFriend({ params }, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.id },
        { $addToSet: { friends: params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: "There is no user with this id!" });
        return;
      }
      res.json(user);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(404).json({ message: "Invalid user ID!" });
        return;
      }
      res.status(500).json(err);
    }
  },
  // DELETE to remove a friend from a user's friend list
  async deleteFriend({ params }, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.id },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: "There is no user with this id!" });
        return;
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
