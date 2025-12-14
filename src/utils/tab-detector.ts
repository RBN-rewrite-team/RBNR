// 定义检测结果类型
export interface TabDetectionResult {
	isMultiTab: boolean;
	tabCount: number;
	tabIds: string[];
	timestamp: number;
	method: DetectionMethod;
}

// 检测方法枚举
export enum DetectionMethod {
	LOCAL_STORAGE = 'local_storage',
}

// 事件类型
export interface MultiTabEvent {
	type: 'tab_opened' | 'tab_closed' | 'heartbeat';
	tabId: string;
	timestamp: number;
	data?: any;
}

// 配置选项
export interface MultiTabDetectorOptions {
	heartbeatInterval?: number; // 心跳间隔（毫秒）
	timeout?: number; // 超时时间（毫秒）
	detectionMethod?: DetectionMethod; // 检测方法
	onMultipleTabs?: (result: TabDetectionResult) => void; // 多开回调
	onSingleTab?: (result: TabDetectionResult) => void; // 单开回调
}

export class LocalStorageTabDetector {
	private readonly storageKey = 'multi_tab_detection';
	private readonly heartbeatKey = 'heartbeat';
	private tabId: string;
	private heartbeatInterval: number;
	private timeout: number;
	private isActive: boolean = true;
	private listeners: Map<string, ((data: any) => any)[]> = new Map();

	constructor(
		private options: {
			heartbeatInterval?: number;
			timeout?: number;
			onMultipleTabs?: (result: TabDetectionResult) => void;
			onSingleTab?: (result: TabDetectionResult) => void;
		} = {},
	) {
		this.tabId = this.generateTabId();
		this.heartbeatInterval = options.heartbeatInterval || 2000;
		this.timeout = options.timeout || 5000;

		this.init();
	}

	private generateTabId(): string {
		return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private init(): void {
		// 注册标签页
		this.registerTab();

		// 开始心跳
		this.startHeartbeat();

		// 监听storage事件
		window.addEventListener('storage', this.handleStorageEvent.bind(this));

		// 监听页面卸载
		window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
		window.addEventListener('unload', this.handleBeforeUnload.bind(this));

		// 初始检测
		this.detectMultipleTabs();
	}

	private registerTab(): void {
		const tabs = this.getActiveTabs();
		tabs[this.tabId] = Date.now();
		localStorage.setItem(this.storageKey, JSON.stringify(tabs));
	}

	private getActiveTabs(): Record<string, number> {
		try {
			const data = localStorage.getItem(this.storageKey);
			return data ? JSON.parse(data) : {};
		} catch {
			return {};
		}
	}

	private startHeartbeat(): void {
		setInterval(() => {
			if (!this.isActive) return;

			const tabs = this.getActiveTabs();
			tabs[this.tabId] = Date.now();

			// 清理过期标签页
			Object.keys(tabs).forEach((tabId) => {
				if (Date.now() - tabs[tabId] > this.timeout) {
					delete tabs[tabId];
				}
			});

			localStorage.setItem(this.storageKey, JSON.stringify(tabs));
			this.emitHeartbeat();
		}, this.heartbeatInterval);
	}

	private handleStorageEvent(event: StorageEvent): void {
		if (event.key === this.storageKey) {
			this.detectMultipleTabs();
		}
	}

	private handleBeforeUnload(): void {
		this.isActive = false;
		const tabs = this.getActiveTabs();
		delete tabs[this.tabId];
		localStorage.setItem(this.storageKey, JSON.stringify(tabs));
	}

	public detectMultipleTabs(): TabDetectionResult {
		const tabs = this.getActiveTabs();
		const tabIds = Object.keys(tabs);
		const isMultiTab = tabIds.length > 1;
		const result: TabDetectionResult = {
			isMultiTab,
			tabCount: tabIds.length,
			tabIds,
			timestamp: Date.now(),
			method: DetectionMethod.LOCAL_STORAGE,
		};

		if (isMultiTab && this.options.onMultipleTabs) {
			this.options.onMultipleTabs(result);
		}
		if (!isMultiTab && this.options.onSingleTab) {
			this.options.onSingleTab(result);
		}

		this.emit('detection', result);
		return result;
	}

	public getTabId(): string {
		return this.tabId;
	}

	public getActiveTabCount(): number {
		return Object.keys(this.getActiveTabs()).length;
	}

	// 事件系统
	public on(event: string, callback: (data: any) => any): void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}
		this.listeners.get(event)!.push(callback);
	}

	public off(event: string, callback: (data: any) => any): void {
		const callbacks = this.listeners.get(event);
		if (callbacks) {
			const index = callbacks.indexOf(callback);
			if (index > -1) {
				callbacks.splice(index, 1);
			}
		}
	}

	private emit(event: string, data?: any): void {
		const callbacks = this.listeners.get(event);
		if (callbacks) {
			callbacks.forEach((callback) => callback(data));
		}
	}

	private emitHeartbeat(): void {
		this.emit('heartbeat', {
			tabId: this.tabId,
			timestamp: Date.now(),
		});
	}

	public destroy(): void {
		this.isActive = false;
		window.removeEventListener('storage', this.handleStorageEvent.bind(this));
		window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
		window.addEventListener('unload', this.handleBeforeUnload.bind(this));

		// 清理当前标签页
		const tabs = this.getActiveTabs();
		delete tabs[this.tabId];
		localStorage.setItem(this.storageKey, JSON.stringify(tabs));
	}
}

export class MultiTabDetector {
	private detectors: {
		localStorage?: LocalStorageTabDetector;
	} = {};

	private currentMethod: DetectionMethod;
	private results: Map<DetectionMethod, TabDetectionResult> = new Map();

	constructor(private options: MultiTabDetectorOptions = {}) {
		this.currentMethod = options.detectionMethod || DetectionMethod.LOCAL_STORAGE;
		this.initDetectors();
	}

	private initDetectors(): void {
		// 初始化localStorage检测器
		if (this.supportsLocalStorage()) {
			this.detectors.localStorage = new LocalStorageTabDetector({
				heartbeatInterval: this.options.heartbeatInterval,
				timeout: this.options.timeout,
				onMultipleTabs: this.handleMultipleTabs.bind(this),
				onSingleTab: this.handleSingleTab.bind(this),
			});
		}
	}

	private supportsLocalStorage(): boolean {
		try {
			return 'localStorage' in window && window.localStorage !== null;
		} catch {
			return false;
		}
	}

	private handleMultipleTabs(result: TabDetectionResult): void {
		this.results.set(result.method, result);

		if (this.options.onMultipleTabs) {
			this.options.onMultipleTabs(result);
		}
	}
	private handleSingleTab(result: TabDetectionResult): void {
		this.results.set(result.method, result);

		if (this.options.onSingleTab) {
			this.options.onSingleTab(result);
		}
	}

	public async detect(): Promise<TabDetectionResult[]> {
		const results: TabDetectionResult[] = [];

		if (this.detectors.localStorage) {
			results.push(this.detectors.localStorage.detectMultipleTabs());
		}

		// 异步获取其他检测器的结果
		await new Promise((resolve) => setTimeout(resolve, 100));

		return results;
	}

	public getConsensusResult(): TabDetectionResult | null {
		if (this.results.size === 0) return null;

		// 取最新结果
		let latestResult: TabDetectionResult | null = null;
		for (const result of this.results.values()) {
			if (!latestResult || result.timestamp > latestResult.timestamp) {
				latestResult = result;
			}
		}

		return latestResult;
	}

	public setDetectionMethod(method: DetectionMethod): void {
		this.currentMethod = method;
	}

	public getActiveMethods(): DetectionMethod[] {
		const methods: DetectionMethod[] = [];
		if (this.detectors.localStorage) methods.push(DetectionMethod.LOCAL_STORAGE);
		return methods;
	}

	public destroy(): void {
		if (this.detectors.localStorage) {
			this.detectors.localStorage.destroy();
		}
	}
}
// 工具函数：快速检测
export async function quickDetectMultiTab(
	options: { timeout?: number; method?: DetectionMethod } = {},
): Promise<boolean> {
	const timeout = options.timeout || 5000;

	return detectViaLocalStorage(timeout);
}

async function detectViaLocalStorage(timeout: number): Promise<boolean> {
	try {
		const key = 'multi_tab_quick_check';
		const timestamp = Date.now();
		const oldValue = localStorage.getItem(key);

		// 写入当前时间戳
		localStorage.setItem(key, timestamp.toString());

		// 短暂延迟后检查
		await new Promise((resolve) => setTimeout(resolve, 100));

		const currentValue = localStorage.getItem(key);

		// 如果值被其他标签页修改过
		return currentValue !== timestamp.toString();
	} catch {
		return false;
	}
}
