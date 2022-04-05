export interface ICardEntityClient {
    id: UniqueId;
    lastFourNumber: string;
    expires: ExpiresType;
    cardholder: string;
}

export class CardEntity {
    private readonly id: UniqueId;
    private readonly expires: ExpiresType;
    private readonly number: string;
    private readonly cardholder: string;

    constructor(
        id: UniqueId,
        expiresMonth: string,
        expiresYear: string,
        number: string,
        cardholder: string = "unknown"
    ) {
        this.id = id;
        this.expires = { year: expiresYear, month: expiresMonth };
        this.number = number;
        this.cardholder = cardholder;
    }

    public prepareForClient() {
        const lastFourNumber = this.number.toString().slice(-4);

        return {
            id: this.id,
            lastFourNumber,
            expires: this.expires,
            cardholder: this.cardholder
        };
    }

    public get getId() {
        return this.id;
    }
    public get getExpires() {
        return this.expires;
    }
    public get getNumber() {
        return this.number;
    }
    public get getCardholder() {
        return this.cardholder;
    }
}
