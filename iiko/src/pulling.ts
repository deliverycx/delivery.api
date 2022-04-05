import { config } from "dotenv";
config({
    path: __dirname + "/../.development.env"
});
process.chdir(`${__dirname}/../..`);
import axios from "axios";
import { Types, Document } from "mongoose";

import { GeoCoder } from "./lib/geocoder";

//models
import { OrganizationModel } from "./database/models/organization.model";
import { CityModel } from "./database/models/city.model";
import { connection } from "./database/connection";
import { CategoryModel } from "./database/models/category.model";
import { ProductModel } from "./database/models/product.model";
import { DownloadImage } from "./lib/download";

const _axios = axios.create({
    baseURL: process.env.SERVICE_URL
});
const geoCoder = new GeoCoder(process.env.YANDEX_APIKEY);
const downloader = new DownloadImage();

class IikoRequester {
    public token: string;
    private cities: Record<string, Array<any>>;

    constructor(
        private readonly login: string,
        private readonly password: string,
        private readonly env: string = "dev"
    ) {}

    private async getToken() {
        const { data } = await _axios.get(
            `/api/0/auth/access_token?user_id=${this.login}&user_secret=${this.password}`
        );

        this.token = data;
    }

    private async getAddresses() {
        const token = this.token;

        const { data } = await _axios.get(
            `/api/0/organization/list?access_token=${token}`
        );

        // console.log(data);
        this.cities = {};

        for (let i = 0; i < data.length; i++) {
            const organization = data[i];
            if (
                this.env === "prod" &&
                organization.description.match("HIDDEN")
            ) {
                continue;
            }

            const matchesAddress = organization.address.match(
                /(?<city>.*?),\s?(?<street>.*)/i
            );

            if (matchesAddress) {
                const { city, street } = matchesAddress.groups;

                const { position } = await geoCoder.resolve(
                    organization.address
                );

                const organizationInArray = {
                    street,
                    guid: organization.id,
                    longitude: position[0],
                    latitude: position[1],
                    workTime: organization.workTime.split(";")[0],
                    phone: organization.phone
                };

                if (city in this.cities) {
                    this.cities[city.trim()].push(organizationInArray);
                } else {
                    this.cities = {
                        ...this.cities,
                        [city.trim()]: [organizationInArray]
                    };
                }
            }
        }

        for (let city in this.cities) {
            const cityId = new Types.ObjectId();

            const organizations = [];

            for (let i = 0; i < this.cities[city].length; i++) {
                const { guid, longitude, latitude, street, workTime, phone } =
                    this.cities[city][i];

                const objectId = await OrganizationModel.findOneAndUpdate(
                    { id: guid },
                    {
                        $setOnInsert: {
                            id: guid,
                            city: cityId,
                            address: {
                                street,
                                longitude,
                                latitude
                            },
                            phone,
                            workTime
                        }
                    },
                    { upsert: true, new: true }
                );

                this.cities[city][i] = {
                    ...this.cities[city][i],
                    objectId
                };

                organizations.push(objectId);
            }

            await CityModel.updateOne(
                { name: city },
                {
                    $setOnInsert: {
                        _id: cityId,
                        name: city
                    },
                    $set: {
                        organizations
                    }
                },
                { upsert: true }
            );
        }
    }

    private async getNomenclature() {
        let categoriesArray = [];
        let productsArray = [];

        for (let city in this.cities) {
            for (let i = 0; i < this.cities[city].length; i++) {
                await this.getToken();

                const { guid, objectId } = this.cities[city][i];
                const { data } = await _axios.get(
                    `/api/0/nomenclature/${guid}?access_token=${this.token}`
                );

                const revisionFromDatabase = await OrganizationModel.findOne(
                    { id: guid },
                    { revision: 1 }
                ).lean();

                const { groups, products, revision } = data;

                console.log(revisionFromDatabase, revision);

                if (revision === revisionFromDatabase.revision) {
                    continue;
                }

                for (let i = 0; i < groups.length; i++) {
                    const { name, order, images, id, description } = groups[i];

                    if (description === "HIDDEN") {
                        continue;
                    }

                    const image = images
                        ? images[images.length - 1]?.imageUrl
                        : "";

                    const category = {
                        _id: new Types.ObjectId(),
                        id,
                        name,
                        order,
                        organization: objectId,
                        image: await downloader.download(image, 70)
                    };
                    categoriesArray.push(category);
                }

                categoriesArray.push({
                    _id: new Types.ObjectId(),
                    organization: objectId,
                    name: "Избранное",
                    order: categoriesArray.length,
                    image: "/static/shop/favorite.png"
                });

                for (let i = 0; i < products.length; i++) {
                    console.log(products[i].name);

                    const category = categoriesArray.find(
                        (category) => category.id === products[i].parentGroup
                    );

                    if (!category) {
                        continue;
                    }

                    const {
                        name,
                        description,
                        additionalInfo,
                        order,
                        id,
                        price,
                        tags,
                        images,
                        measureUnit,
                        weight
                    } = products[i];

                    const image = images
                        ? images[images.length - 1]?.imageUrl
                        : "";

                    console.log(objectId);

                    const product = {
                        category: category._id,
                        organization: objectId,
                        name,
                        description,
                        order,
                        id,
                        image: await downloader.download(image, 300),
                        additionalInfo,
                        tags,
                        measureUnit: measureUnit,
                        price,
                        weight
                    };
                    productsArray.push(product);
                }

                await CategoryModel.deleteMany({ organization: objectId });
                await CategoryModel.insertMany(categoriesArray);
                categoriesArray = [];

                await ProductModel.deleteMany({ organization: objectId });
                await ProductModel.insertMany(productsArray);
                productsArray = [];

                await OrganizationModel.updateOne(
                    { id: guid },
                    { $set: { revision } }
                );

                console.log(data);
            }
        }
    }

    public async polling() {
        await this.getToken();
        await this.getAddresses();
        await this.getNomenclature();
    }
}

const iikoRequester = new IikoRequester(
    process.env.SERVICE_LOGIN,
    process.env.SERVICE_PASSWORD,
    process.env.ENV_FLAG
);

connection().then(async () => {
    console.log("success connect");
    await iikoRequester.polling();

    process.exit(0);
});
