import {
    Controller,
    Post,
    Body,
    Res,
    UseGuards,
    UseFilters,
    Inject
} from "@nestjs/common";
import { iiko } from "src/services/iiko/interfaces";
import { IPaymentWebhookDto } from "../../order/dto/paymentWebhook.dto";
import { response, Response } from "express";
import { PaymentService } from "src/services/payment/payment.service";
import { YooWebhookGuard } from "src/guards/yooWebhook.guard";
import { UnauthorizedFilter } from "src/filters/unauthorized.filter";
import { IikoWebhookGuard } from "src/guards/iikoWebhook.guard";
import { IIiko } from "src/services/iiko/iiko.abstract";
import { IikoWebsocketGateway } from "src/services/iiko/iiko.gateway";
import { ApiBody, ApiProperty, ApiResponse } from "@nestjs/swagger";
import { StopListEntity } from "src/components/stopList/entities/stopList.entity";
import { PaymasterResponse } from "src/services/payment/sdk/types/response.type";
import { MailService } from "src/services/mail/mail.service";
import { string } from "joi";
import { subscriptionDTO, subscriptionResponse } from "src/services/mail/mail.gateway";
import { Bot } from "src/services/duplicateBot/interfaces";
import { BotReverveTableDTO } from "src/services/duplicateBot/bot.DTO";
import { IBotService } from "src/services/duplicateBot/bot.abstract";

@Controller("webhook")
export class WebhookController {
    constructor(
        @Inject("IIiko")
        private readonly IikoService: IIiko,

        private readonly PaymentService: PaymentService,
        private readonly IikoStopListGateway: IikoWebsocketGateway,
        private readonly MailService: MailService,
        private readonly BotService: IBotService
    ) {}

    @Post("paymentCallback")
    //@UseGuards(YooWebhookGuard)
    async yowebhook(
        @Body() body: IPaymentWebhookDto,
        @Res() response: Response
    ) {

			console.log('ответ из пумастера тело',body);
        if (body.status === PaymasterResponse.PaymentStatuses.SUCCESSED) {
						const check:any = await this.PaymentService.checkPymentOrder({paymentid:body.id})
						if(!check){
							try {
								
								await this.PaymentService.captrurePayment(body);
								await this.BotService.PaymentOrder(body.invoice.params.orgguid,{...body,statusOrder:'В обработке'})
							} catch (error) {
								await this.BotService.PaymentOrder(body.invoice.params.orgguid,{...body,statusOrder:'Ошибка при заказе'})
							}
							
						}
        }

        response.status(200).json({});
    }

    @ApiResponse({
        description:
            "Подключение по http://localhost:9870/iiko для дева, и для прода / и указать порт 9870. Слушать событие stoplist_event",
        type: StopListEntity
    })
    @Post("stoplist")
    //@UseGuards(IikoWebhookGuard)
    async iikowebhook(
        @Body() body: iiko.stoplist,
        @Res() response: Response
    ) {
        
				/*
        try {

						
            //const stopListEntity = await this.IikoService.getStopList(body);

            this.IikoStopListGateway.sendStopListToClient({});

            response.status(200).json({});
        } catch (e) {
            console.log(e);
        }
				*/
				try {
					const stopListEntity = await this.IikoService.getStopList(body.organizationId);

					response.status(200).json(stopListEntity)
				} catch (error) {
					response.status(500).json({})
				}
				
				
    }
    
    @ApiResponse({
      description:
          "Подписка",
      type: subscriptionResponse
    })
    @ApiBody({
      type: subscriptionDTO
    })
    @Post("subscription")
    async subscriptionMail(
        @Body() body: subscriptionDTO,
        @Res() response: Response
    ) {
        try {
            await this.MailService.sendMail(body.to)
            response.status(200).json({status:'ok'});
        } catch (e) {
            console.log(e);
        }
    }
    

  @Post("revervetable")
    async reverveTable(
        @Body() body: BotReverveTableDTO,
        @Res() response: Response
    ) {
      try {
				await this.BotService.sendReserveTable(body)
      	response.status(200).json({status:'ok'});
			} catch (error) {
				response.status(400).json({status:'no'});
			}
    }
		@Post("push")	
		async push(@Body() body:any){
			
			const result = await this.PaymentService.checkPymentOrderStatus(body)
			if(result){
				console.log('возврат для бота',result);
				await this.BotService.ReturnPaymentOrder(result.organizationid,result) //result.organizationid
			}
			return 'ok'
		}

		@Post("getstreet")	
		async getStreet(@Body() body:any){
			 return await this.IikoService.getStreetCityIkko(body)
		}
}
