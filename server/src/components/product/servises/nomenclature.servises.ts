import { Inject, Injectable } from "@nestjs/common";
import { IIkoAxios } from "src/services/iiko/iiko.axios";
import { IProductRepository } from "../repositories/interface.repository";
import { Types, Document } from "mongoose";

@Injectable()
export class NomenclatureServises {
	constructor(
		private readonly productRepository: IProductRepository,
		@Inject("IIKO_AXIOS")
		private readonly axios: IIkoAxios,
	) { }

	async getNomenClature(organization: string) {
		const nomenclature = await this.axios.getNomenClature(organization)

		const categoryes = this.NomenClatureCategory(nomenclature.groups, organization)
		const products = this.NomenClatureProducts(nomenclature.products)

		return {
			categoryes: categoryes.length !== 0 ? categoryes : null,
			products: products.length !== 0 ? products : null
		}
	}


	NomenClatureCategory(category: any[], organization: string) {
		const cat = category.map((value) => {
			const { name, order, images, imageLinks, id, description } = value;
			const image = imageLinks
				? imageLinks[imageLinks.length - 1]
				: "";

				const category = {
					_id: new Types.ObjectId(),
					organization: organization,
					id,
					name,
					order,
					description,
					image: image,

				};
				return category

		}).filter(item => item.description !== 'HIDDEN').sort((a: any, b: any) => (a.order - b.order))

		cat.push({
			_id: new Types.ObjectId(),
			id: 'favorite',
			organization: organization,
			name: "Избранное",
			order: cat.length,
			description: '',
			image: "/static/shop/favorite.png"
		});
		return cat
	}

	NomenClatureProducts(products: any) {
		const prods = products.map((prod: any) => {
			const {
				name,
				parentGroup,
				description,
				additionalInfo,
				order,
				id,
				tags,
				code,
				images,
				imageLinks,
				measureUnit,
				weight
			} = prod;
			

			const price = Math.trunc(prod.sizePrices[0].price.currentPrice)


			const image = imageLinks
				? imageLinks[imageLinks.length - 1]
				: "";

			const product = {
				category: parentGroup,
				name,
				description,
				order,
				id,
				productId: id,
				image: image,
				additionalInfo,
				tags,
				code,
				measureUnit: measureUnit,
				price,
				weight
			};


			return product
		})
		return prods
	}
}