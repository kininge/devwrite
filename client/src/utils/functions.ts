/** @format */

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};
	return date.toLocaleDateString("en-US", options);
}
