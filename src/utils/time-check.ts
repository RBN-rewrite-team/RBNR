import { isDeveloper } from '@/core/save/testing';

// //@ts-nocheck
// const TIME_SERVERS = [
// 	{
// 		name: 'Time.is',
// 		url: 'https://time.is/api/timezone/Asia/Shanghai.json',
// 		parser: (data: any) => new Date(data.json()).getTime(),
// 	},
// 	{
// 		name: '淘宝时间API',
// 		url: 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp',
// 		parser: (data: any) => parseInt(data.data.t),
// 	},
// 	{
// 		name: 'WorldTimeAPI',
// 		url: 'http://worldtimeapi.org/api/timezone/Asia/Shanghai',
// 		parser: (data: any) => data.unixtime * 1000,
// 	},
// 	{
// 		name: 'TimeAPI',
// 		url: 'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Shanghai',
// 		parser: (data: any) => new Date(data.dateTime).getTime(),
// 	},
// 	{
// 		name: '腾讯时间API',
// 		url: 'https://api.m.sm.cn/s?q=1',
// 	},
// ];
const THRESHOLD = 10 * 60 * 1000;
export async function timeCheck() {
	if (isDeveloper()) return;
	try {
		const response = await fetch('.', {
			headers: {
				'Cache-Control': 'no-cache',
			},
		});
		const GMTdate = response.headers.get('Date');
		if (!GMTdate) {
			throw new Error("Server doesn't return Date header.");
		}
		const currentTime = new Date(GMTdate);
		const timeOffset = Math.abs(currentTime.getTime() - Date.now());
		console.log('Time Sync: Time offset ' + timeOffset);
		if (timeOffset >= THRESHOLD) {
			//console.warn('时间连续体已被破坏！');
		} else {
			setTimeout(timeCheck, 20000);
		}
		return;
	} catch (error) {
		console.warn(`请求失败:`, error);
	}

	console.log('无法获取标准时间');
	throw new Error('无法获取标准时间');
}
