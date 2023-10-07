export function getTimePassed(fromDate: Date, untilDate: Date) {
	const dateDifference = untilDate.getTime() - fromDate.getTime();
	const yearsPassed = new Date(dateDifference).getUTCFullYear() - 1970;
	if (yearsPassed > 0) {
		return { timePassed: yearsPassed, unit: "year" };
	}

	let monthsPassed = (untilDate.getFullYear() - fromDate.getFullYear()) * 12;
	monthsPassed += untilDate.getMonth() - fromDate.getMonth();
	if (fromDate.getDate() > untilDate.getDate()) {
		monthsPassed--;
	}
	if (monthsPassed > 0) {
		return { timePassed: monthsPassed, unit: "month" };
	}

	const secondsPassed = Math.ceil(dateDifference / 1000);
	if (secondsPassed < 60) {
		return { timePassed: secondsPassed, unit: "second" };
	}

	const minutesPassed = Math.floor(secondsPassed / 60);
	if (minutesPassed < 60) {
		return { timePassed: minutesPassed, unit: "mintue" };
	}

	const hoursPassed = Math.floor(minutesPassed / 60);
	if (hoursPassed < 24) {
		return { timePassed: hoursPassed, unit: "hour" };
	}

	const daysPassed = Math.floor(hoursPassed / 24);
	return { timePassed: daysPassed, unit: "day" };
}
