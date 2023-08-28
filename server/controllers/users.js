import User from "../models/user.js";

/*READ*/

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    if (friends) {
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
          };
        }
      );
      return res.status(200).json(formattedFriends);
    } else {
      return res.status(404).json({ error: "No friends found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
/*UPDATE*/

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user && friend) {
      if (user.friends.includes(friendId)) {
        //this removes a friend with specified id(friendId) from the user's friends array
        user.friends = user.friends.filter((id) => id !== friendId);
        //this removes a user with specified id(id) from the friend's friends array
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        //otherwise the friend will be added to the user's friend's array and the opposite
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
          };
        }
      );
      return res.status(200).json(formattedFriends);
    } else {
      return res.status(400).send("bad request");
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
