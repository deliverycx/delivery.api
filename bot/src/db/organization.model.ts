import { prop, getModelForClass } from "@typegoose/typegoose";

export class OrganizationClass {
    @prop({ type: () => String })
    organization: string;

    @prop({ type: () => Number })
    chat: number;
}

export const OrganizationModel = getModelForClass(OrganizationClass);
