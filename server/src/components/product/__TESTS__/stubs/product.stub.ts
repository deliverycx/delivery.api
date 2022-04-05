import * as mongoose from "mongoose";

export const categoriesIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()
];

export const productsStub = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Test1",
        category: categoriesIds[0],
        price: 200,
        weight: 0.993
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Test2",
        category: categoriesIds[1],
        price: 331,
        weight: 0.339
    }
];
