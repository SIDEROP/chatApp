import { User } from "../../models/User.js";

export const userStatusOnline = async (userIds) => {
  try {
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { status: "online" } },
    );
  } catch (error) {
    console.error("Error updating user statuses:", error);
  }
};

export const userStatusOfline = async (userIds) => {
  try {
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { status: "offline" } },
    );
  } catch (error) {
    console.error("Error updating user statuses:", error);
  }
};
