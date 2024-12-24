const ng = [
	{
		id: "7dcec94b-1109-439b-a27a-47ef897289ad",
		data: [
			{
				d: new Date(2024, 12, 24),
				time: "11:00-18:00"
			},
			{
				d: new Date(2024, 12, 25),
				time: "13:00-23:00"
			},

		]
	},
]

const trueDate = new Date();
function formatDate(date: any) {
	var dd: any = date.getDate();
	if (dd < 10) dd = '0' + dd;

	var mm: any = date.getMonth() + 1;
	if (mm < 10) mm = '0' + mm;

	var yy: any = date.getFullYear() % 100;
	if (yy < 10) yy = '0' + yy;

	return dd + '.' + mm + '.' + yy;
}
export const ngFNs = (org: any) => {

	let time: any;

	ng.forEach((val: any) => {
		if (val.id == org) {
			val.data.forEach((value: any) => {
				if (formatDate(trueDate) === formatDate(value.d)) {
					//console.log(value.time);
					time = value.time;
				}
			});
		}
	});

	return time;
}

export const fnNG = () => {
	let tt: any

	function updateWorkTime(workTime, work) {
		const today = new Date(); // текущая дата

		/*
		const q = work.map((value: any) => {
			const workDate = value.d;
			console.log(formatDate(workDate), formatDate(trueDate));
			if (formatDate(workDate) === formatDate(trueDate)) {
				const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
				console.log(dayIndex);
				workTime[dayIndex] = value.time;
			}

		})
		*/


		/*
		work.forEach((entry) => {
		const todayWork = work.find(
			(entry) =>
				entry.d.getFullYear() === today.getFullYear() &&
				entry.d.getMonth() === today.getMonth() &&
				entry.d.getDate() === today.getDate()
		);

		if (todayWork) {
			// Вычисляем индекс дня недели (0 - воскресенье, 1 - понедельник, ...)
			const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

			// Обновляем время в workTime по индексу текущего дня
			workTime[dayIndex] = todayWork.time;
		}
		*/


		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
		startOfWeek.setHours(0, 0, 0, 0);

		// Получаем конец текущей недели (воскресенье)
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		endOfWeek.setHours(23, 59, 59, 999);

		// Обходим каждый объект в массиве work
		work.forEach((entry) => {
			const workDate = entry.d;

			// Проверяем, входит ли дата в текущую неделю
			if (workDate >= startOfWeek && workDate <= endOfWeek) {
				// Вычисляем индекс дня недели (0 - воскресенье, 1 - понедельник, ...)
				const dayIndex = workDate.getDay() === 0 ? 6 : workDate.getDay() - 1;

				// Обновляем время в workTime по индексу дня недели
				if (workTime[dayIndex]) {
					workTime[dayIndex] = entry.time;
				}
			}
		});


		return workTime;
	}

	const workTime = [
		"15:00-22:00",
		"10:00-22:00",
		"10:00-22:00",
		"10:00-18:00",
		"10:00-22:00",
		"10:00-22:00",
		"10:00-22:00",
	];

	const work = [
		{
			d: new Date(2024, 11, 24), // Месяцы в JavaScript начинаются с 0
			time: "11:00-14:00",
		},
		{
			d: new Date(2024, 11, 25),
			time: "13:00-16:00",
		},
	];

	const updatedWorkTime = updateWorkTime(workTime, work);
	console.log("updatedWorkTime", updatedWorkTime);
}