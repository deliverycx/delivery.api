import { config } from "dotenv";
config({
    path: __dirname + "/../../.env"
});
import { DOMParser } from "xmldom";

import axios from "axios";

export class GeoCoder {
    constructor(private readonly apikey: string) {}

    public async resolve(
        address: string
    ): Promise<{ position: [number, number] }> {
        const result = await axios.get(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${
                this.apikey
            }&geocode=${encodeURI(address)}`
        );
        const doc = new DOMParser().parseFromString(result.data, "text/xml");

        const resultParse = doc.getElementsByTagName("Point");

        const tuple = resultParse[0].firstChild.textContent.split(" ");
        return {
            position: [+tuple[0], +tuple[1]]
        };
    }
}
