import { CartEntity } from "src/components/cart/entities/cart.entity";

export const validationHIdiscount = (cart:any) =>{
	const regex = new RegExp('HI' + "-\\d+", "i");

	const {count,sum} = cart.reduce((acc:{count:number,sum:number[]},cartEl) =>{
		const tagIndex = cartEl.tags
                    ? cartEl.tags.findIndex((el) => el.match(regex))
                    : -1;
		
		if (cartEl.tags && tagIndex !== -1) {
			return {
				count:acc.count + cartEl.amount,
				sum:[...acc.sum,cartEl.price]
			}
			
			
		}else{
			return acc
		}							
		
	}, {
		count:0,
		sum:[]
	})

		let c = 0
	
		for (let i = 1; i <= count; i++) {
			
			if (i % 12 === 0) {
				c += 1
				
			}
		}
	

	return {
		count,
		min:Math.min(...sum) * c
	}

}