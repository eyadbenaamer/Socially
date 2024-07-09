import { Types } from "mongoose";
import Conversation from "../models/conversation.js";

const { ObjectId } = Types;
export const getAll = async (req, res) => {
  try {
    const { user } = req;

    const conversations = await Conversation.aggregate([
      {
        $match: {
          messages: {
            $elemMatch: {
              to: {
                $elemMatch: {
                  _id: user._id,
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          messages: {
            $slice: [
              {
                $filter: {
                  input: "$messages",
                  as: "message",
                  cond: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$message.to",
                        as: "to",
                        in: {
                          $eq: ["$$to._id", user._id],
                        },
                      },
                    },
                  },
                },
              },
              -10,
            ],
          },
          updatedAt: 1,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);
    return res.status(200).json(conversations);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const getOne = async (req, res) => {
  try {
    let { page, conversationId } = req.query;
    const { user } = req;
    if (!page) {
      page = 1;
    }

    const conversation = await Conversation.aggregate([
      {
        $match: {
          _id: new ObjectId(conversationId),
          messages: {
            $elemMatch: {
              to: {
                $elemMatch: {
                  _id: user._id,
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          messages: {
            $slice: [
              {
                $filter: {
                  input: "$messages",
                  as: "message",
                  cond: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$message.to",
                        as: "to",
                        in: {
                          $eq: ["$$to._id", user._id],
                        },
                      },
                    },
                  },
                },
              },
              -10,
            ],
          },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);
    return res.status(200).json(conversation);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const clear = async (req, res) => {
  try {
    const { forEveryOne } = req.query;
    const { user, conversation } = req;

    if (forEveryOne === "true") {
      conversation.messages = [];
      await conversation.save();
      return res.status(200).send("success");
    }
    conversation.messages.map((message) => {
      /*
      if the message is deleted for everyone except this user, then delete the entire 
      message instead of just deleting the user's ID from "to property
       */
      if (message.to.length === 1) {
        message.deleteOne();
      } else {
        message.to.id(user._id).deleteOne();
      }
    });
    await conversation.save();
    return res.status(200).send("success");
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
