import { connect } from "mongoose";

export async function connection() {
    await connect(process.env.MONGO_URL);
}
