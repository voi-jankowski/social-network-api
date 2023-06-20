const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { userSeedData, thoughtSeedData, reactionSeedData } = require("./data");

connection.once("open", async () => {
  try {
    console.log("connected");
    // Delete all collections if they exist
    let userCheck = await connection.db
      .listCollections({ name: "users" })
      .toArray();
    let thoughtCheck = await connection.db
      .listCollections({ name: "thoughts" })
      .toArray();

    if (userCheck.length) {
      await connection.dropCollection("users");
    }
    if (thoughtCheck.length) {
      await connection.dropCollection("thoughts");
    }

    // Bulk create users
    const users = await User.insertMany(userSeedData);

    // Bulk create thoughts
    const thoughts = await Thought.insertMany(thoughtSeedData);

    // Loop through thoughts and add reactions
    for (let i = 0; i < thoughts.length; i++) {
      // Get two random reactions from the reactionSeedData array to add to each thought provided they are not the same and not the same as the thought's username
      const reactions = [];
      let reaction1 = reactionSeedData[Math.floor(Math.random() * 9)];
      let reaction2 = reactionSeedData[Math.floor(Math.random() * 9)];

      while (reaction1.username === thoughts[i].username) {
        reaction1 = reactionSeedData[Math.floor(Math.random() * 9)];
      }

      while (reaction2.username === thoughts[i].username) {
        reaction2 = reactionSeedData[Math.floor(Math.random() * 9)];
      }

      while (reaction1 === reaction2) {
        reaction2 = reactionSeedData[Math.floor(Math.random() * 9)];
      }

      reactions.push(reaction1);
      reactions.push(reaction2);

      // Add reactions to thought
      await Thought.findByIdAndUpdate(thoughts[i]._id, {
        reactions: reactions,
      });
    }

    // Loop through users and add friends
    for (let i = 0; i < users.length; i++) {
      // Get a random number of friends to add
      const friendCount = Math.floor(Math.random() * 5) + 1;

      // Get a random user from the users array
      const friends = [];
      for (let j = 0; j < friendCount; j++) {
        let friend = users[Math.floor(Math.random() * users.length)];

        // Make sure the friend is not the same as the user
        if (friend._id.toString() !== users[i]._id.toString()) {
          friends.push(friend._id);
        }
      }

      // Add friends to user
      await User.findByIdAndUpdate(users[i]._id, { friends: friends });
    }

    console.log("Users seeded:", await User.find());
    console.log("Thoughts seeded:", await Thought.find());
    console.info("All done!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
});
