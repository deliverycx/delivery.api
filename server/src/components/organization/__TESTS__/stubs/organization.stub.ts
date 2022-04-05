import { mongoose } from "@typegoose/typegoose";

export const citiesIds = [new mongoose.Types.ObjectId()];

export const organizationStubs = [
    {
        _id: new mongoose.Types.ObjectId(),
        phone: "+799999999999",
        workTime: "10:00-22:00",
        address: {
            street: "test street",
            longitude: 45.345214,
            latitude: 55.555555
        },
        city: citiesIds[0]
    }
];
