import * as mongoose from "mongoose";

export const organizationId = new mongoose.Types.ObjectId();
export const organizationStub = {
    _id: organizationId,
    address: {
        street: "test street"
    },
    id: "fe470000-906b-0025-00f6-08d8de6557e1"
};
