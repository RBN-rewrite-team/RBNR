export function stringformat(template: string, replacements: string[]): string {
	let currentIndex = 0;
	return template.replace(/\{\}/g, () =>
		currentIndex < replacements.length ? replacements[currentIndex++] : '{}',
	);
}
