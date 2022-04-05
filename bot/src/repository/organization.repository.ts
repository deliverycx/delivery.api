import { OrganizationModel } from "../db/organization.model";

export class OrganizationRepository {
    static async getOne(organization: string) {
        return await OrganizationModel.findOne({ organization }).lean();
    }

    static async register(chat: number, organization: string) {
        return await OrganizationModel.create({ organization, chat });
    }

    static async removeOne(chat: number, organization: string) {
        return await OrganizationModel.deleteOne({ organization, chat });
    }
}
