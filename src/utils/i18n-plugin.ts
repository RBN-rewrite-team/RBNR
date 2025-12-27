import { defineComponent, type App } from 'vue';

// const Translation = defineComponent({
// 	name: 'Translation',
// 	setup() {},
// });
const default3 = {
	install(app: App<any>) {
		console.log(app);

		// app.component('bxd', Translation);
		app.config.globalProperties['bxd'] = function () {
			return 'bxd';
		};
		// window.app = app;
	},
};

export default default3;
