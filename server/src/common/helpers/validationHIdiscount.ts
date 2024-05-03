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

export const validationHachapuriFO = (cart:any) => {
	/**/
	const filteredItems = cart.filter(item => item.tags && item.tags.includes('forhach')).slice(0, 4);
	const {count,sum} = filteredItems.reduce((acc:{count:number,sum:number[]},cartEl) =>{

		return {
			count:acc.count + cartEl.amount,
			sum:acc.sum + cartEl.sum
		}						
		
	}, {
		count:0,
		sum:0
	})
	//console.log(filteredItems);
	


	if(count >= 4){
		return{
			active:true,
			coutn:4
		}
	}else{
		return{
			active:false,
			coutn:count
		}
	}
	
	/*
	
	const filteredItems = cart.filter(item => item.tags && item.tags.includes('forhach'));
    const totalAmount = filteredItems.reduce((acc, item) => acc + item.amount, 0);
    let sum = filteredItems.reduce((total, item) => total + item.sum, 0);
		console.log( Math.floor(totalAmount / 4));
    if (totalAmount >= 4) {
        const discountedPrice = 1099;
        const discountedSum = discountedPrice * Math.floor(totalAmount / 4);
        sum = Math.min(sum, discountedSum);
    }
    
   console.log(sum);
};
*/
/*
let sum = 0;
    let count = 0;
		let fulsum = 0
		let finalprice = 0
    cart.forEach(item => {
        if (item.tags && item.tags.includes('forhach')) {
            count += item.amount;
            while (count >= 4) { // Применяем акцию "4 хачапури по 1099"
                sum += 1099;
                count -= 4;
								
            }
						fulsum += item.sum

						console.log((count % 4));
            //finalprice += item.sum * (count % 4); // Добавляем стоимость оставшихся хачапури, если их количество не кратно 4
        }

    });
    console.log(sum,fulsum,finalprice);
		*/
/*
const mass = [
  {
    id: 'ba6ce0ae-9dfe-4e65-8c5e-a43517f9c60e',
    name: 'Хачапури по-аджарски',
    amount: 5,
    sum: 1525,
    tags: [ 'forhach' ],
    price: 305,
    code: '1907'
  },
  {
    id: '40fd0199-f700-46eb-883d-2c578adacfae',
    name: 'Хачапури по-аджарски мини',
    amount: 2,
    sum: 360,
    tags: [ 'forhach' ],
    price: 180,
    code: '1906'
  },
  {
    id: '114a67b7-d4d2-4850-945d-195325ecbc87',
    name: 'Хачапури по-аджарски чкмерули',
    amount: 1,
    sum: 345,
    tags: [ 'forhach' ],
    price: 345,
    code: '1915'
  }
];
*/
}