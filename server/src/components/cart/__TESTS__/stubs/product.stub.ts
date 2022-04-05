import * as mongoose from "mongoose";

export const productsStub = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Test1",
        price: 222,
        weight: 0.222
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Test2",
        price: 333,
        weight: 0.333
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "TestValidation1",
        price: 4444,
        weight: 0.444,
        tags: ["HI-2"]
    }
];
