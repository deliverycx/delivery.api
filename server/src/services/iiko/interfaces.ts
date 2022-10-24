export namespace iiko {
    export enum ResultStateEnum {
        Success = 0,
        RejectByMinSum = 1,
        RejectByWorkTime = 2,
        RejectByZone = 3,
        RejectByStopList = 4,
        RejectByPriceList = 5
    }

    export enum MessageResultStateEnum {
        "_0" = "Доставка была успешна распределена",
        "_1" = "Отклонено по минимальной сумме заказа",
        "_2" = "Отклонено по времени работы заведения",
        "_3" = "В эту зону доставка не осуществляется",
        "_4" = "Продукт из заказа находится в стоп-листе",
        "_5" = "Продукт из заказа запрещен к продаже"
    }

    export interface ICheckResult {
        numState: ResultStateEnum;
        message: MessageResultStateEnum;
    }

    export enum WebhookTypesEnum {
        "StopListUpdate" = "StopListUpdate"
    }

    export interface IWebhookEvent {
        eventType: WebhookTypesEnum.StopListUpdate;
        eventTime: string;
        organizationId: UniqueId;
        correlationId: UniqueId;
        eventInfo: any;
    }

		export interface stoplist {
			organizationId: UniqueId;
	}

    export interface IStopListItem {
        productId: UniqueId;
				product:UniqueId;
        balance: number;
    }

    export interface IStopListItems {
        organizationId: UniqueId;
        items: Array<IStopListItem>;
    }

    export interface IStopListBody {
        stopList: Array<IStopListItems>;
    }

    interface INestedAddressBody {
        city: string;
        street: string;
        home: number;
        apartment: number;
        doorphone: number;
        entrance: number;
        floor: number;
    }
    interface INestedItemsBody {
        id: UniqueId;
        name: string;
        amount: number;
        price?: number;
    }
    interface INestedOrderBody {
        phone: string;
        address: INestedAddressBody;
        items: Array<INestedItemsBody>;
        comment: string;
        orderTypeId: string;
        isSelfService: string;
    }

    export interface IOrderBody {
        organization: UniqueId;
        customer: {
            name: string;
            phone: string;
        };
        order: INestedOrderBody;
    }

		export interface IZone{
			name:string
			coordinates:[{
				latitude:number,
				longitude:number
			}]
		}
}
