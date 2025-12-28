import { player } from '@/core/save';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import './cardinal.css';

function clickon() {
	if (player.withinCardinal) player.closedWorldTitle = true;
}

export default defineComponent({
	name: 'EnterTheCardinalWorld',
	setup(props, ctx) {
		const canvasRef = ref<HTMLCanvasElement>();
		const animationFrameId = ref<number>();
		const diffRef = ref(0);
		const pointList = Array.from({ length: 1000 }, () => ({
			angle: Math.random() * 360,
			speed: (Math.random() + 0.5) * 0.025,
			distance: Math.random() * 600 + 100,
		}));

		const rings = [
			172000, 175000, 178000, 180000, 181000, 182000, 183000, 184000, 570000, 610000,
		];
		for (let i = 185; i <= 350; i += 0.5) {
			rings.push(i * 1000);
		}

		function differ() {
			const WIP_MS = 1 * 670000;
			let d = Date.now();
			if (!player.thedoorofcardinalstate) return 0;
			if (d - player.thedoorofcardinaltime >= WIP_MS)
				player.thedoorofcardinaltime = d - WIP_MS;
			return d - player.thedoorofcardinaltime;
		}

		const updateDiff = () => {
			diffRef.value = differ();
			if (diffRef.value > 0 && canvasRef.value) {
				drawCanvas();
			}
			if (diffRef.value < 670000) {
				animationFrameId.value = requestAnimationFrame(updateDiff);
			}
		};

		const drawCanvas = () => {
			if (!canvasRef.value) return;

			const canvas = canvasRef.value;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const diff = diffRef.value;
			const width = (canvas.width = canvas.clientWidth);
			const height = (canvas.height = canvas.clientHeight);
			const centerX = width / 2;
			const centerY = height / 2;
			const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));

			ctx.clearRect(0, 0, width, height);

			const globalOpacity = diff < 5000 ? diff / 5000 : 1;
			ctx.globalAlpha = globalOpacity;

			if (diff > 5000) {
				if (diff < 8000) {
					const crossOpacity = Math.sin(((diff - 8000) / 3000) * 4.5 * Math.PI) / 2 + 0.5;
					ctx.globalAlpha = crossOpacity * globalOpacity;

					const gradientX = ctx.createLinearGradient(
						centerX - 25,
						centerY,
						centerX + 25,
						centerY,
					);
					gradientX.addColorStop(0, 'black');
					gradientX.addColorStop(0.5, 'white');
					gradientX.addColorStop(1, 'black');
					ctx.fillStyle = gradientX;
					ctx.fillRect(centerX - 25, centerY - 2, 50, 4);

					const gradientY = ctx.createLinearGradient(
						centerX,
						centerY - 25,
						centerX,
						centerY + 25,
					);
					gradientY.addColorStop(0, 'black');
					gradientY.addColorStop(0.5, 'white');
					gradientY.addColorStop(1, 'black');
					ctx.fillStyle = gradientY;
					ctx.fillRect(centerX - 2, centerY - 25, 4, 50);

					ctx.fillStyle = 'white';
					ctx.beginPath();
					ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
					ctx.fill();
					ctx.shadowColor = 'white';
					ctx.shadowBlur = 3;
					ctx.fill();
					ctx.shadowBlur = 0;
				} else {
					ctx.globalAlpha = globalOpacity;
					const gradientX = ctx.createLinearGradient(
						centerX - 25,
						centerY,
						centerX + 25,
						centerY,
					);
					gradientX.addColorStop(0, 'black');
					gradientX.addColorStop(0.5, 'white');
					gradientX.addColorStop(1, 'black');
					ctx.fillStyle = gradientX;
					ctx.fillRect(centerX - 25, centerY - 2, 50, 4);

					const gradientY = ctx.createLinearGradient(
						centerX,
						centerY - 25,
						centerX,
						centerY + 25,
					);
					gradientY.addColorStop(0, 'black');
					gradientY.addColorStop(0.5, 'white');
					gradientY.addColorStop(1, 'black');
					ctx.fillStyle = gradientY;
					ctx.fillRect(centerX - 2, centerY - 25, 4, 50);

					ctx.fillStyle = 'white';
					ctx.beginPath();
					ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
					ctx.fill();
					ctx.shadowColor = 'white';
					ctx.shadowBlur = 3;
					ctx.fill();
					ctx.shadowBlur = 0;
				}

				rings.forEach((ringTime) => {
					if (diff >= ringTime && diff <= ringTime + 4000) {
						const radius = (diff - ringTime) / 0.95;
						ctx.strokeStyle = 'white';
						ctx.lineWidth = 2;
						ctx.globalAlpha = globalOpacity;
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
						ctx.stroke();
					}
				});

				const ringConfigs = [
					{ start: 8000, end: 12000, divisor: 1 },
					{ start: 8500, end: 12500, divisor: 0.975 },
					{ start: 9000, end: 13000, divisor: 0.95 },
					{ start: 9500, end: 13500, divisor: 0.9 },
					{ start: 10000, end: 14000, divisor: 0.85 },
					{ start: 10400, end: 14400, divisor: 0.775 },
					{ start: 10800, end: 14800, divisor: 0.7 },
					{ start: 11100, end: 15100, divisor: 0.6 },
					{ start: 11350, end: 15350, divisor: 0.5 },
				];

				ringConfigs.forEach((config) => {
					if (diff >= config.start && diff <= config.end) {
						const radius = (diff - config.start) / config.divisor;
						ctx.strokeStyle = 'white';
						ctx.lineWidth = 2;
						ctx.globalAlpha = globalOpacity;
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
						ctx.stroke();
					}
				});

				const lineConfigs = [
					{ start: 9150, end: 12350, angle: 35 },
					{ start: 10550, end: 12350, angle: 85 },
					{ start: 11250, end: 12350, angle: 25 },
				];

				lineConfigs.forEach((config) => {
					if (diff >= config.start && diff <= config.end) {
						const length = (diff - config.start) * 6;
						const angleRad = (config.angle * Math.PI) / 180;

						const dirX = Math.cos(angleRad);
						const dirY = Math.sin(angleRad);

						const startX = centerX - dirX * length;
						const startY = centerY - dirY * length;
						const endX = centerX + dirX * length;
						const endY = centerY + dirY * length;

						ctx.strokeStyle = 'white';
						ctx.lineWidth = 2;
						ctx.globalAlpha = globalOpacity;
						ctx.beginPath();
						ctx.moveTo(startX, startY);
						ctx.lineTo(endX, endY);
						ctx.stroke();
					}
				});

				if (diff >= 15350) {
					pointList.forEach((point, index) => {
						const pointTime = 15350 + index * 100;
						if (diff >= pointTime && diff < 160000) {
							const t = (diff - pointTime) * point.speed + point.distance;
							if (t > maxDistance) return;

							const radian = (point.angle * Math.PI) / 180;
							const x = centerX + Math.cos(radian) * t;
							const y = centerY + Math.sin(radian) * t;
							const scale = (t - point.distance) / point.speed / 10000;
							const blur = (0.15 - point.speed) * 5;

							ctx.globalAlpha = globalOpacity;
							ctx.fillStyle = 'white';
							ctx.filter = `blur(${blur}px)`
							ctx.beginPath();
							ctx.arc(x, y, 3 * scale, 0, Math.PI * 2);
							ctx.fill();
							ctx.filter = `none`
						}
					});
				}

				if (diff >= 15350) {
					const gradient1 = ctx.createRadialGradient(
						centerX,
						centerY,
						0,
						centerX,
						centerY,
						maxDistance,
					);
					const progress1 = Math.min(1, (diff - 15350) / (120000 - 15350));
					gradient1.addColorStop(0, 'rgba(0, 0, 0, 0)');
					gradient1.addColorStop(1 - progress1, 'rgba(0, 0, 0, 0)');
					gradient1.addColorStop(1, 'red');

					let opacity1 = diff >= 160000 ? 0.25 - (diff - 160000) / 4000 : 0.25;
					opacity1 = Math.max(0, opacity1);

					ctx.globalAlpha = opacity1 * globalOpacity;
					ctx.fillStyle = gradient1;
					ctx.fillRect(0, 0, width, height);
				}

				if (diff >= 180000) {
					const gradient2 = ctx.createRadialGradient(
						centerX,
						centerY,
						0,
						centerX,
						centerY,
						maxDistance,
					);
					const progress2 = Math.min(1, (diff - 180000) / (284650 - 180000));
					gradient2.addColorStop(0, 'rgba(0, 0, 0, 0)');
					gradient2.addColorStop(1 - progress2, 'rgba(0, 0, 0, 0)');
					gradient2.addColorStop(1, 'red');

					let opacity2 = diff >= 324650 ? 0.25 - (diff - 324650) / 4000 : 0.25;
					opacity2 = Math.max(0, opacity2);

					ctx.globalAlpha = opacity2 * globalOpacity;
					ctx.fillStyle = gradient2;
					ctx.fillRect(0, 0, width, height);
				}

				if (diff >= 500000) {
					const gradient3 = ctx.createRadialGradient(
						centerX,
						centerY,
						0,
						centerX,
						centerY,
						maxDistance,
					);
					const progress3 = Math.min(1, (diff - 500000) / (604650 - 500000));
					gradient3.addColorStop(0, 'rgba(0, 0, 0, 0)');
					gradient3.addColorStop(1 - progress3, 'rgba(0, 0, 0, 0)');
					gradient3.addColorStop(1, 'red');

					let opacity3 = diff >= 644650 ? 0.25 - (diff - 644650) / 4000 : 0.25;
					opacity3 = Math.max(0, opacity3);

					ctx.globalAlpha = opacity3 * globalOpacity;
					ctx.fillStyle = gradient3;
					ctx.fillRect(0, 0, width, height);
				}
			}
		};

		const handleResize = () => {
			if (canvasRef.value) {
				drawCanvas();
			}
		};

		onMounted(() => {
			updateDiff();
			window.addEventListener('resize', handleResize);
		});

		onUnmounted(() => {
			if (animationFrameId.value) {
				cancelAnimationFrame(animationFrameId.value);
			}
			window.removeEventListener('resize', handleResize);
		});

		const getAlertText = () => {
			const diff = diffRef.value;
			if (diff > 150000 && diff <= 152000) return '警报：检测到强力压制';
			if (diff > 152000 && diff <= 154000) return '世界隧道出现异常！';
			if (diff > 154000 && diff <= 156000) return '附近时空结构开始塌陷';
			if (diff > 156000 && diff <= 158000) return '异常加深，请注意！';
			if (diff > 158000 && diff <= 160000) return '世界隧道部分区域崩溃，请注意避开';
			return '';
		};

		const getVeryRDefieText = () => {
			const diff = diffRef.value;
			if (diff > 75000 && diff <= 77000) return '（收到VeryRDefie的专频信号）';
			if (diff > 77000 && diff <= 79000) return 'VeryRDefie: 你好！';
			if (diff > 79000 && diff <= 81000) return 'VeryRDefie: 现在你可能看不到我。';
			if (diff > 81000 && diff <= 83000) return 'VeryRDefie: 但是我与你一起进入了隧道。';
			if (diff > 83000 && diff <= 85000)
				return 'VeryRDefie: 刚刚暴君九头蛇对你发动了一次打击，不过偏了。';
			if (diff > 85000 && diff <= 87000)
				return 'VeryRDefie: 小心了！这里不再安全。一会在说吧。';
			if (diff > 87000 && diff <= 180000) return '（VeryRDefie频道静默）';
			if (diff > 180000 && diff <= 182000)
				return 'VeryRDefie：这里已经是世界之间的绝对深空了。';
			if (diff > 182000 && diff <= 184000)
				return 'VeryRDefie：在脱离了刚刚的打击之后，九头蛇一时半会也无法锁定你。';
			if (diff > 184000 && diff <= 186000)
				return 'VeryRDefie：但这只是暂时，接下来的下一次打击，恐怕……';
			if (diff > 186000 && diff <= 188000) return 'VeryRDefie：……';
			if (diff > 188000 && diff <= 270000) return '（VeryRDefie频道静默）';
			if (diff > 270000 && diff <= 274000) return 'VeryRDefie：差不多九头蛇应该又要来了...';
			if (diff > 274000 && diff <= 400000) return '（VeryRDefie频道静默）';
			if (diff > 400000 && diff <= 404000) return 'VeryRDefie：400.000秒。';
			if (diff > 404000 && diff <= Infinity) return '（VeryRDefie频道静默）';
			return '';
		};

		const getAlphaVIIText = () => {
			const diff = diffRef.value;
			if (player.retribution >= 2) {
				if (diff > 160000 && diff <= 162000) return '（收到Alpha VII的专频信号）';
				if (diff > 162000 && diff <= 164000) return 'Alpha VII：你在吗？我检查到了危险。';
				if (diff > 164000 && diff <= 166000) return 'Alpha VII：没错，我也跟过来了。';
				if (diff > 166000 && diff <= 168000)
					return 'Alpha VII：你既然能打开基数通道，我们肯定不会放过机会。';
				if (diff > 168000 && diff <= 170000)
					return 'Alpha VII：这边我暂时屏蔽了这一次打击。';
				if (diff > 170000 && diff <= 172000)
					return 'Alpha VII：据我所知，世界隧道的长度可能容纳四次袭击……';
				if (diff > 172000 && diff <= 174000) return 'Alpha VII：行程已经过半。';
				if (diff > 174000 && diff <= 176000)
					return 'Alpha VII：后面的路途仍然充满危险。回见。';
				if (diff > 176000 && diff <= 210000) return '（Alpha VII频道静默）';
				if (diff > 210000 && diff <= 212000)
					return 'Alpha VII：我大致定位了下一次打击的位置……';
				if (diff > 212000 && diff <= 214000) return 'Alpha VII：……但这并不能帮助你躲过。';
				if (diff > 214000 && diff <= 216000)
					return 'Alpha VII：我发现大数世界已经在排斥我们的存在。';
				if (diff > 216000 && diff <= 218000)
					return 'Alpha VII：这意味着如果你被摧毁，通道和我们都会不复存在。';
				if (diff > 218000 && diff <= 220000) return 'Alpha VII：……';
				if (diff > 220000 && diff <= Infinity) return '（Alpha VII频道静默）';
			}
			return '';
		};

		const getDamofrostText = () => {
			const diff = diffRef.value;
			if (player.retribution >= 3) {
				if (diff > 340000 && diff <= 342000) return '（收到Damofrost的专频信号）';
				if (diff > 342000 && diff <= 344000) return 'Damofrost：危。';
				if (diff > 344000 && diff <= 346000) return 'Damofrost：刚刚你又被锁定了一次。';
				if (diff > 346000 && diff <= 348000) return 'Damofrost：……我用自身能量屏蔽了它。';
				if (diff > 348000 && diff <= 350000) return 'Damofrost：基数世界就在前方。';
				if (diff > 350000 && diff <= 352000) return 'Damofrost：九头蛇不会容许你轻易过去。';
				if (diff > 352000 && diff <= 354000)
					return 'Damofrost：祂一定会在最后关头再次试图阻止你。';
				if (diff > 354000 && diff <= 356000) return 'Damofrost：一定注意。';
				if (diff > 356000 && diff <= Infinity) return '（Damofrost频道静默）';
			}
			return '';
		};

		return () => {
			const diff = diffRef.value;
			const opacity = diff < 5000 ? diff / 5000 : 1;

			return diff > 0 ? (
				<>
					<div
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							top: 0,
							left: 0,
							zIndex: 10,
							backgroundColor: 'black',
							opacity: opacity,
						}}
						onClick={clickon}
					>
						{diff > 5000 && (
							<>
								<canvas
									ref={canvasRef}
									style={{
										position: 'absolute',
										width: '100%',
										height: '100%',
										top: 0,
										left: 0,
										zIndex: 11,
									}}
								/>

								<div
									style={{
										position: 'absolute',
										left: '50%',
										top: '70%',
										fontSize: '14px',
										color: 'rgb(192, 0, 0)',
										transform: 'translate(-50%, -50%)',
										zIndex: 12,
									}}
								>
									{getAlertText()}
								</div>
								<div
									style={{
										position: 'absolute',
										left: '50%',
										top: 'calc(70% + 24px)',
										fontSize: '14px',
										color: 'gold',
										transform: 'translate(-50%, -50%)',
										zIndex: 12,
									}}
								>
									{getVeryRDefieText()}
								</div>
								{player.retribution >= 2 && (
									<div
										style={{
											position: 'absolute',
											left: '50%',
											top: 'calc(70% + 48px)',
											fontSize: '14px',
											color: 'red',
											transform: 'translate(-50%, -50%)',
											zIndex: 12,
										}}
									>
										{getAlphaVIIText()}
									</div>
								)}
								{player.retribution >= 3 && (
									<div
										style={{
											position: 'absolute',
											left: '50%',
											top: 'calc(70% + 72px)',
											fontSize: '14px',
											color: 'cyan',
											transform: 'translate(-50%, -50%)',
											zIndex: 12,
										}}
									>
										{getDamofrostText()}
									</div>
								)}

								{player.thedoorofcardinalcrisis !== 999 &&
									diff > 370000 &&
									diff < 670000 && (
										<div>
											<div
												style={{
													position: 'absolute',
													left: '50%',
													top: '50%',
													width: `${((diff - 370000) / 296666) * document.body.offsetWidth * 1.25}px`,
													height: `${((diff - 370000) / 296666) * document.body.offsetWidth * 1.25}px`,
													fontSize: '14px',
													borderRadius: `${(((diff - 370000) / 296666) * document.body.offsetWidth * 1.25) / 2}px`,
													background: '#ffffff',
													zIndex: 10000,
													opacity: `${((diff - 370000) / 296666) * 100}%`,
													boxShadow: 'white 0px 0px 4px 4px',
													transform: 'translate(-50%, -50%)',
												}}
											></div>
										</div>
									)}

								{player.thedoorofcardinalcrisis !== 999 &&
									diff > 666666 &&
									!player.closedWorldTitle && (
										<div
											style={{
												position: 'absolute',
												left: '50%',
												top: '50%',
												width: '300%',
												height: '300%',
												fontSize: '64px',
												background: 'white',
												zIndex: 10000,
												color: 'black',
												transform: 'translate(-50%, -50%)',
											}}
										>
											<div
												style={{
													position: 'absolute',
													left: '50%',
													top: '50%',
													transform: 'translate(-50%, -50%)',
												}}
												class="enteredText"
											>
												基数世界
											</div>
											<div
												style={{
													position: 'absolute',
													left: '50%',
													top: 'calc(50% + 54px)',
													transform: 'translate(-50%, -50%) scale(0.5)',
												}}
												class="enteredText"
											>
												Cardinal World
											</div>
											<div
												style={{
													position: 'absolute',
													left: '50%',
													top: 'calc(50% + 90px)',
													transform: 'translate(-50%, -50%) scale(0.5)',
												}}
												class="enteredText"
											>
												Tap to Continue
											</div>
										</div>
									)}

								{player.thedoorofcardinalcrisis === 999 &&
									player.thedoorofcardinaltime < 666000 && (
										<div
											style={{
												position: 'absolute',
												left: '50%',
												top: '50%',
												width: '200vw',
												height: '200vh',
												fontSize: '14px',
												background: '#ffffff',
												zIndex: 10000,
												boxShadow: 'white 0px 0px 500px 4px',
											}}
											class={'crisis'}
										></div>
									)}
							</>
						)}
					</div>
				</>
			) : (
				<></>
			);
		};
	},
});
