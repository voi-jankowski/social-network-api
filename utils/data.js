const userSeedData = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "alexander",
    email: "alexander@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "emily",
    email: "emily@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "michael123",
    email: "michael123@example.com",
    thoughts: [],
    friends: [],
  },
];

const thoughtSeedData = [
  {
    thoughtText: "First thought",
    username: "john_doe",
    reactions: [],
  },
  {
    thoughtText: "Second thought",
    username: "jane_smith",
    reactions: [],
  },
  {
    thoughtText: "Third thought",
    username: "alexander",
    reactions: [],
  },
  {
    thoughtText: "Fourth thought",
    username: "emily",
    reactions: [],
  },
  {
    thoughtText: "Fifth thought",
    username: "michael123",
    reactions: [],
  },
];

const reactionSeedData = [
  {
    reactionBody: "Great thought!",
    username: "john_doe",
  },
  {
    reactionBody: "Interesting!",
    username: "jane_smith",
  },
  {
    reactionBody: "I agree.",
    username: "alexander",
  },
  {
    reactionBody: "I disagree.",
    username: "emily",
  },
  {
    reactionBody: "I don't know.",
    username: "michael123",
  },
];

module.exports = {
  userSeedData,
  thoughtSeedData,
  reactionSeedData,
};
