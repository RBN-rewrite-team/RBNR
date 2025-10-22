const TIME_SERVERS = [
	{
		name: 'Time.is',
		url: 'https://time.is/api/timezone/Asia/Shanghai.json',
		parser: (data: any) => new Date(data.json()).getTime()
	},
	{
		name: '淘宝时间API',
		url: 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp',
		parser: (data: any) => parseInt(data.data.t)
	},
	{
		name: 'WorldTimeAPI',
		url: 'http://worldtimeapi.org/api/timezone/Asia/Shanghai',
		parser: (data: any) => data.unixtime * 1000
	},
	{
		name: 'TimeAPI',
		url: 'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Shanghai',
		parser: (data: any) => new Date(data.dateTime).getTime()
	},
	{
		name: '腾讯时间API',
		url: 'https://api.m.sm.cn/s?q=1',
	},
];

export async function timeCheck() {
	for (const server of TIME_SERVERS) {
		try {
			//console.log(`尝试从 ${server.name} 获取时间...`);
			const response = await fetch(server.url);
			const data = await response.json();
			
			const timestamp = server.parser(data);
			//@ts-ignore
			let currentTime = new Date(timestamp);
			console.log(currentTime);
			let timeOffset = Math.abs(currentTime - Date.now());
			
			if(timeOffset >= 120000)
			{
				//console.warn('时间连续体已被破坏！');
			}
			else
			{
				//setTimeout(timeCheck, 5000);
			}
		} catch (error) {
			console.warn(`${server.name} 请求失败:`, error);
			continue;
		}
	}
	
	//console.log('无法获取标准时间');
	//throw new Error('无法获取标准时间');
}