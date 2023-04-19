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
        orderTypeName: string;
				orderType:string;
				ONSPOTTable:number;
    }
    export interface IRequestBodyReserve{
        organizationId: UniqueId
        fullname: string
        date: string
        preson: number
        time: string
    }
}
