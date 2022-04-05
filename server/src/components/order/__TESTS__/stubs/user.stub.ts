import * as mongoose from "mongoose";

export const userId = new mongoose.Types.ObjectId();
export const userStub = {
    _id: userId,
    username: "u_dddddddd"
};
