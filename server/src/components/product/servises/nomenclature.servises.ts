import { Inject, Injectable } from "@nestjs/common";
import { IIkoAxios } from "src/services/iiko/iiko.axios";
import { IProductRepository } from "../repositories/interface.repository";
import { Types, Document } from "mongoose";
import { AdminAxiosRequest } from "src/services/admin.request";

@Injectable()
export class NomenclatureServises {
	constructor(
		private readonly productRepository: IProductRepository,
		@Inject("IIKO_AXIOS")
		private readonly axios: IIkoAxios,
		private readonly adminAxios:AdminAxiosRequest
	) { }

	async getNomenClature(organization: string) {
	
		console.log(organization);
		const nomenclature =  await this.adminAxios.getOrganizationList(organization)//await this.axios.getNomenClature(organization)

		const categoryes = this.NomenClatureCategory(nomenclature.groups, organization)
		const products = this.NomenClatureProducts(nomenclature.products)

		return {
			categoryes: categoryes.length !== 0 ? categoryes : null,
			products: products.length !== 0 ? products : null
		}
	}


	NomenClatureCategory(category: any[], organization: string) {
		const cat = category.map((value) => {
			const { name, order, images, imageLinks, id, description, tags } = value;
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
				tags

			};
			return category

		}).filter(item => item.description !== 'HIDDEN').sort((a: any, b: any) => (a.order - b.order))

		/*
		cat.push({
			_id: new Types.ObjectId(),
			id: 'favorite',
			organization: organization,
			name: "Избранное",
			order: cat.length,
			description: '',
			image: "/static/shop/favorite.png"
		});
		*/
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

	async getSouses(organization: string) {
		const nomenclature = await this.getNomenClature(organization)

		if (nomenclature) {
			
			const randomSous = []

			// ищем категорию соусы
			const catsosus = nomenclature.categoryes.find((val) => {
				if (val.tags && Array.isArray(val.tags)) {
					if (val.tags[0] === "sous") {
						return val
					}
				}
			})
			// находим товары по соусам

			const sosusProducts = catsosus && nomenclature.products.filter((product) => {
				return product.category === catsosus.id
			})
			const randoms = (arr, r, n) => {
				for (let i = 0; i < n; i += 1) {
					arr.push(r.splice(Math.floor(Math.random() * r.length), 1)[0]);
				}
			}

			catsosus && randoms(randomSous, sosusProducts, 4)
			return randomSous
		}
	}

	async AdditionProducts(organization: string) {

		const nomenclature = await this.getNomenClature(organization)

		if (nomenclature) {
			const randomProduct = []
			const randomSous = []

			// ищем категорию соусы
			const catsosus = nomenclature.categoryes.find((val) => {
				if (val.tags && Array.isArray(val.tags)) {
					if (val.tags[0] === "sous") {
						return val
					}
				}
			})
			// находим товары по соусам

			const sosusProducts = catsosus && nomenclature.products.filter((product) => {
				return product.category === catsosus.id
			})

			// все короме соусов
			const products = nomenclature.products.filter((val) => {
				if (val.tags && Array.isArray(val.tags)) {
					if (val.tags[0] !== "sous") {
						return val
					}
				}
			})

			const randoms = (arr, r, n) => {
				for (let i = 0; i < n; i += 1) {
					arr.push(r.splice(Math.floor(Math.random() * r.length), 1)[0]);
				}
			}

			catsosus && randoms(randomSous, sosusProducts, 3)
			products && randoms(randomProduct, products, 6)


			return randomSous.concat(randomProduct)
		}
	}
}