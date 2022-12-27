import { CityClass } from "../../../database/models/city.model";
import { Mapper } from "../../../common/abstracts/mapper.interface";
import { OrganizationEntity } from "./organization.entity";
import { OrganizationClass } from "../../../database/models/organization.model";

const trueDate = new Date()
function formatDate(date:any) {

  var dd:any = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm:any = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy:any = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

const ng = [
	{
		id:"fe470000-906b-0025-00f6-08d8de6557e1",
		data:[
			{
				d:new Date(2022,11,26),
				time:"00:00-00:00"
			},
			
		]
	},
	{
		id:"fe470000-906b-0025-307f-08d8dfb88a89",
		data:[
			{
				d:new Date(2022,11,26),
				time:"12:00-18:00"
			}
		]
	}
]

const ngFN = (org:any) =>{
	let time:any

	ng.forEach((val:any) =>{
		if(val.id == org.id){
			
			val.data.forEach((value:any) =>{
				console.log(formatDate(trueDate),formatDate(value.d));
				//console.log(trueDate,value.d);
				if(formatDate(trueDate) === formatDate(value.d)){
					//console.log(value.time);
					time = value.time
				}
			})
		}
	})

	return time
}

export const organizationMapper: Mapper<
    Array<OrganizationClass>,
    Array<OrganizationEntity>
	> = (p) => {
	
    return p.map((organization) => {
				const q = ngFN(organization)

				console.log(q);
        return new OrganizationEntity(
            organization._id,
            organization.address.street,
            (organization.city as CityClass)?.name,
            [organization.address.latitude, organization.address.longitude],
            organization.phone,
            q ? q : organization.workTime,
            organization.id,
            organization.delivMetod,
            organization.isHidden,
						organization.reservetable
        );
    });
};
