export namespace Bot {
    export interface IRequestBody {
        items: Array<{
            name: string;
            amount: number;
        }>;
        comment: string;
        name: string;
        phone: string;
        address: string;
        orderType: string;
    }
    export interface IRequestBodyReserve{
        organizationId: UniqueId
        fullname: string
        date: string
        preson: number
        time: string
    }
}
