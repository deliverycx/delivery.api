import { connect } from "mongoose";

export function connection() {
    console.log(process.env.CONNECTION);
    return connect(process.env.CONNECTION as string);
}
