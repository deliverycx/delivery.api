import {
    Controller,
    Post,
    Body,
    Res,
    UseGuards,
    UseFilters,
    Inject,
		Get,
		Param,
		Query
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
import { ClientProxy } from "@nestjs/microservices";
import axios from 'axios';
import { WebHookServices } from "../services/webhook.services";
import { AdminAxiosRequest } from "src/services/admin.request";


@Controller("webhook")
export class WebhookController {
    constructor(
        @Inject("IIiko")
        private readonly IikoService: IIiko,

        private readonly PaymentService: PaymentService,
        private readonly IikoStopListGateway: IikoWebsocketGateway,
				private readonly adminAxiosRequest: AdminAxiosRequest,
        private readonly MailService: MailService,
        private readonly BotService: IBotService,
				private readonly webHookServices: WebHookServices
    ) {}

    @Post("paymentCallback")
    //@UseGuards(YooWebhookGuard)
    async yowebhook(
        @Body() body: IPaymentWebhookDto,
        @Res() response: Response
    ) {
 
			console.log('ответ из пумастера тело',body);
        if (body.status === PaymasterResponse.PaymentStatuses.AUTHORIZED || body.status === PaymasterResponse.PaymentStatuses.SUCCESSED) {
						const check:any = await this.PaymentService.checkPymentOrder(body.invoice.params.hash,body.id)
						if(check){
							try {
								
								await this.PaymentService.captrurePayment(body);
								await this.BotService.PaymentOrder(body.invoice.params.organization,{...body,statusOrder:"Обработан"})
							} catch (error) {
								await this.BotService.PaymentOrder(body.invoice.params.organization,{...body,statusOrder:"Ошибка"})
								console.log(error);
							}
							
						}
        }

        response.status(200).json({});
    }

		@Post("paymentCreate")
    async paymasterPayCreate(
        @Body() body: any,
      
    ) {
			const url = await this.PaymentService.createPayMasterPayment(body)
			return url
		}

		/*
		@Post("paymentCallbackBar")
    //@UseGuards(YooWebhookGuard)
    async yowebhookBar(
        @Body() body: any,
        @Res() response: Response
    ) {

			console.log('ответ БАР из пумастера тело',body);
        if (body.status === PaymasterResponse.PaymentStatuses.AUTHORIZED || body.status === PaymasterResponse.PaymentStatuses.SUCCESSED) {
						const check:any = await this.PaymentService.checkPymentOrder({orderId:body.invoice.params.orderId})
						if(check){
							try {
								
								await this.PaymentService.captrurePaymentBar(body);
								await this.BotService.PaymentOrder(body.invoice.params.idorganization,{...body,statusOrder:'Бар оплачен'})
							} catch (error) {
								await this.BotService.PaymentOrder(body.invoice.params.idorganization,{...body,statusOrder:'Ошибка при оплате Бара'})
								console.log(error);
							}
							
						}
        }

        response.status(200).json({});
    }
	

		@Get("dualPayment/:hash")
    //@UseGuards(YooWebhookGuard)
    async dualpayment(
				@Param("hash") hash: string,
        @Res() response: Response
    ){
			try {
				const check:any = await this.PaymentService.checkPymentOrder({orderHash:hash})
				if(check){
					response.status(200).json(check);
				}
			} catch (error) {
				response.status(400).json({error:'Заказ не найден'});
			}
			
		}

		@Post("dualPaymentCreate")
    //@UseGuards(YooWebhookGuard)
    async dualpaymentcreate(
				@Body() body:any,
        @Res() response: Response
    ){
			try {
				console.log(body);
				const check:any = await this.PaymentService.checkPymentOrder({orderHash:body.hash})
				if(check){
					const payurl = await this.PaymentService.createBarPayment(check,body.localhost)
					response.status(200).json(payurl);
				}
			} catch (error) {
				response.status(400).json({error:'Заказ не найден'});
			}
			
		}
	*/

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
			//console.log('терминал',body);

			/*
			const result = await this.PaymentService.checkPymentOrderStatus(body)
			if(result){
				
				await this.BotService.canselPaymentOrder(result.organizationid,result) //result.organizationid
			}
			*/
			return 'ok'
		}

		@Post("test")	
		async test(@Body() body:any){
			//console.log('test push',body);
			
			return 'ok'
		}

		@Post("webhooks")	
		async webhooks(@Body() body:any){
			//console.log('test push',body);

			if(Array.isArray(body)){
				body.forEach((value:any)=>{
					if(value.eventType === 'StopListUpdate'){
						this.IikoService.getStopList(value.organizationId)
					}
				})
			}
			
			return 'ok'
		}

		@Post("getstreet")	
		async getStreet(@Body() body:any){
			 //return await this.IikoService.getStreetCityIkko(body)
			 return await this.adminAxiosRequest.getStreets(body.organizationId)
		}


		@Get("daData/:street")
    //@UseGuards(YooWebhookGuard)
    async daData(
				@Param("street") street: string,
        @Res() response: Response
    ){
			
			this.webHookServices.getData(street)
		}


		@Post("flipcount")
    //@UseGuards(YooWebhookGuard)
    async flipcount(
			@Body() body:any
		){

			const token = await axios.get('https://iiko.biz:9900/api/0/auth/access_token?user_id=CX_Apikey_all&user_secret=CX_Apikey_all759')
			const org:any = await axios.get(`https://iiko.biz:9900/api/0/organization/list?access_token=${token.data}`)
			
			const getorgId = org.data.find((el:any) =>{
				
				if(body.phone && el.phone){
					//console.log('qqq',el.phone.replace(/ /g,''),body.phone.replace(/ /g,''));
					return el.phone.replace(/ /g,'') === body.phone.replace(/ /g,'')
				}else{
					return null
				}
				
			})

			if(!getorgId){
				return null
			}
			
			const {data} = await axios.post(`https://iiko.biz:9900/api/0/olaps/olapByPreset?access_token=${token.data}&organizationId=${getorgId.id}&request_timeout=`,
				{
					"dateTo":String(body.time), 
					"dateFrom":body.oldtime,
					"presetId":"9f99fda4-604a-428a-aecc-9563ec53b8e0"
				}
			)


			const w:string = data.data.split(',')[1] as string
			const numEl:any = w.match(/(-?\d+(\.\d+)?)/g)
			const count = Math.trunc(Number(numEl[0]))

			return count
		
		}
}
