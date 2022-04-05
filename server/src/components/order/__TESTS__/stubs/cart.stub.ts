import * as mongoose from "mongoose";
import { productsStub } from "./product.stub";
import { userStub } from "./user.stub";

export const cartStub = [
    {
        _id: new mongoose.Types.ObjectId(),
        user: userStub._id,
        product: productsStub[0]._id,
        amount: 3
    },
    {
        _id: new mongoose.Types.ObjectId(),
        user: userStub._id,
        product: productsStub[1]._id,
        amount: 2
    }
];
