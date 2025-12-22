import { useUpdate } from '@/lib/useUpdate';
import { reactive } from 'vue';

export type Notify = {
	id: number;
	content: string;
	duration: number;
	color: string;
	quiting: boolean;
	start: number;
	expired: boolean;
};
export const notifies: Notify[] = reactive([]);
export function addNotify(content: string, duration?: number, color?: string) {
	const notify = {
		content,
		duration: duration ?? 3,
		color: color ?? 'rgba(0,221,221,0.5)',
		id: Math.random(),
		get quiting() {
			return Date.now() >= this.start + this.duration * 1000;
		},
		start: Date.now(),
		get expired() {
			return Date.now() >= this.start + this.duration * 1000 + 500;
		},
	};

	notifies.push(notify);
}
