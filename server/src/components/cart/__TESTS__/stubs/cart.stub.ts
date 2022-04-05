import { mongoose } from "@typegoose/typegoose";
import { productsStub } from "./product.stub";
import { userStub } from "./user.stub";

export const cartIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()
];

export const cartFirstUserStub = {
    _id: cartIds[0],
    user: userStub._id,
    product: productsStub[0]._id
};

export const cartSecondUserStub = {
    _id: cartIds[1],
    user: new mongoose.Types.ObjectId(),
    product: productsStub[0]._id
};
