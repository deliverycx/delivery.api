import * as mongoose from "mongoose";
import { organizationId } from ".";

export const paymentInfoStub = {
    _id: new mongoose.Types.ObjectId(),
    isActive: true,
    token: "tokentest",
    merchantId: "merchanttest",
    organization: organizationId
};
