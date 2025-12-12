import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function tryGetFingerprintJS() {
	// 初始化 FingerprintJS
	const fpPromise = FingerprintJS.load();
	// 获取浏览器指纹
	const fp = await fpPromise;
	const result = await fp.get();

	const visitorId = result.visitorId;

	return visitorId;
	// fpPromise
	// .then(fp => fp.get())
	// .then(result => {
	// // 获取唯一的 visitorId
	// const visitorId = result.visitorId;
	// console.log(`Visitor ID: ${visitorId}`);
	// });
}
