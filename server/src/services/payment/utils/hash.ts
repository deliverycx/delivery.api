import * as crypto from "crypto";

export function createOrderHash() {
    const returnUrlHash = crypto.randomBytes(8).toString("hex");

    return returnUrlHash;
}
