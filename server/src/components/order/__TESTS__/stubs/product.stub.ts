import * as mongoose from "mongoose";

export const productsStub = [
    {
        _id: new mongoose.Types.ObjectId(),
        id: "66190e86-a907-48a4-9519-81a5112bd086",
        name: "Test1",
        price: 222,
        weight: 0.222
    },
    {
        _id: new mongoose.Types.ObjectId(),
        id: "e579104e-bb96-4f29-a12a-9bf6ab71b587",
        name: "TestValidation1",
        price: 4444,
        weight: 0.444,
        tags: ["HI-2"]
    }
];
