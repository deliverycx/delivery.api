import { CartEntity } from 'src/components/cart/entities/cart.entity';
import { OrderDTO } from 'src/components/order/dto/order.dto';
import { OrganizationEntity } from 'src/components/organization/entities/organization.entity';
import { PaymentInfoEntity } from 'src/components/organization/entities/payments.entity';
import { IOrganizationRepository } from 'src/components/organization/repositories/interface.repository';

export type IPayMasterBody = {

	orderBody:OrderDTO,
	organizationPaymentInfo:PaymentInfoEntity,
	totalPrice:number,
	organizationID:OrganizationEntity
	cart:Array<CartEntity>
	userId:any
}