// prettier-ignore
export default [{id: "news1", text: "不会做增量游戏怎么办？看风灵作成的原代码一个半小时就学会了！"},
{id: "news2", text: "这个游戏实际上的名称是RBNR^5，因为已经重制过4次了。"},
{id: "news3", text: "尝试用ai做了一个增量游戏，结果bug比功能多"},
{id: "news4", text: "点击这里让 砂糖 和 大黑塔 对您做实验"},
{id: "news5", text: "<img src='baixie.png' /><img src='baixie.png' /><img src='baixie.png' />"},
{id: "news6", text: "googology意思是“大数学”，音译为“果糕逻辑”，使用果糕逻辑这个音译名以表示内容之不严谨。"},
{id: "news7", text: "滚动新闻的添加速度将是毁灭性的！！！！！！"},
{id: "news8", text: "代码组建议了一个事项，因为这样他们就只需要复制粘贴了("},
{id: "news9", text: "当3个人同时写代码，Bug和Conflict都将是毁灭性的……"},
{id: "news10", text: "RBNR初期以平均5小时一次大更新的节奏稳步推进着。"},
{id: "news11", text: "@艾斯亿诶嗯叉了叉"},
{id: "news12", text: "要是ADE有我们这个开发速度已经到被粉碎的现实了。"},
{id: "news13", text: "完成第-1层（成就）的时间等于通关这个游戏的时间，完成第-2层（新闻）的时间取决于写新闻代码的人添加了多少奇怪的条件"},
{id: "news14", text: "unicode命名法：String.fromCharCode(初始名字.charCodeAt() + n)，只有《风灵作成》重置层取名参考这玩意儿"},
{id: "news15", text: "Breaking News! 等待10秒，用代码实现Fake news!"},
] as {
	id: string;
	text: string;
	unlocked?: boolean;
	dynamic?: boolean;
	reset?: () => void;
	onClick?: () => string | undefined;
}[];
