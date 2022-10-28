export namespace CreateMessage {
    export interface IRecivedBody {
        items: Array<{
            name: string;
            amount: number;
        }>;
        name: string;
        comment: string;
        orderType: string;
        phone: string;
        address: string;
  }
  export interface ImessageReserveTable {
    fullname: string
    date: string
    person: string
    time: string
    phone:string
	}

	export interface ImessagePaymentOrder {
    id: number,
	  created: string,
	  testMode: boolean,
	  status: string,
	  merchantId: string,
	  amount: { value: number, currency: 'RUB' },
	  invoice: {
	    description: string,
	    params: {
	      orgguid: string,
	      comment: string,
	      phone: string,
	      orderType: string,
	      address_floor: string,
	      address_entrance: string,
	      address_intercom: string,
	      address_flat: string,
	      address_home: string,
	      address_street: string,
	      address_city: string,
	      date: string,
	      name: string,
	      organization: string,
	      hash: string,
	      user: string,
	      paymentMethod: string,
	      localhost: string
	    }
	  },
	  paymentData: {
	    paymentMethod: 'BankCard',
	    paymentInstrumentTitle: string
	  },
	  statusOrder: string
	}

	export interface ImessageRetuntPayment{
		id: string,
	  created: string,
	  status: string,
	  paymentId: string,
	  amount: { value: number, currency: 'RUB' }
	}
}
