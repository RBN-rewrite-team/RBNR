import Decimal from 'break_eternity.js'
import {player} from './save'
import {feature} from './global.ts'
import {format, formatWhole} from "@/utils/format";

var upgrades = {}, buyables = {};

export const UPGRADES = {
	create(id, info){
		upgrades[id] = info;
	},
	lock(id){
		let req = upgrades[id].requirement;
		let reach = [], flag = true;
		for(let i in req)
		{
			reach[i] = req[i][1]();
			if(!reach[i]) flag = false;
		}
		return {show: upgrades[id].show(), unlocked: flag, reach: reach};
	},
	singleHTML(id){
		let useclass = 'upgrade_buttonbig';
		if(player.upgrades[id]) useclass = 'upgrade_buttonbig_complete';
		else if(!this.lock(id).unlocked || !upgrades[id].canAfford()) useclass = 'upgrade_buttonbig_unable';
		let str = '<div class="' + useclass + '">';
		str += '<span sytle="font-weight: bold">U' + id + '</span><br>';
		if(!this.lock(id).unlocked)
		{
			str += '暂未解锁<br>';
			let req = upgrades[id].requirement;
			for(let j in req)
			{
				if(j != 0) str += ',<br>';
				if(req[j][1]()) str += '<span style="color: green; font-weight: bold">';
				else str += '<span style="color: red; font-weight: bold">';
				str += req[j][0];
				if(!req[j][1]() && req[j].length >= 3) str += '(' + req[j][2][0] + '/' + req[j][2][1] + ')';
				str += '</span>';
			}
		}
		else
		{
			str += upgrades[id].description + '<br>';
			if(upgrades[id].effect != null) str += '效果：' + upgrades[id].effD() + '<br>';
			str += '价格：' + format(upgrades[id].cost) + '<br>';
		}
		str += '</div>'
		return str;
	},
	buy(id){
		if(!player.upgrades[id] && this.lock(id).unlocked && upgrades[id].canAfford())
		{
			upgrades[id].buy();
			player.upgrades[id] = true;
		}
	},
};

export const BUYABLES = {
	create(id, info){
		buyables[id] = info;
	},
	lock(id){
		let req = buyables[id].requirement;
		let reach = [], flag = true;
		for(let i in req)
		{
			reach[i] = req[i][1]();
			if(!reach[i]) flag = false;
		}
		return {show: buyables[id].show(), unlocked: flag, reach: reach};
	},
	singleHTML(id){
		let useclass = 'upgrade_buttonbig';
		if(buyables[id].capped()) useclass = 'upgrade_buttonbig_complete';
		else if(!this.lock(id).unlocked || !buyables[id].canAfford(player.buyables[id])) useclass = 'upgrade_buttonbig_unable';
		let str = '<div class="' + useclass + '">';
		str += '<span sytle="font-weight: bold">B' + id + '(' + formatWhole(player.buyables[id]) + ')</span><br>';
		if(!this.lock(id).unlocked)
		{
			str += '暂未解锁<br>';
			let req = buyables[id].requirement;
			for(let j in req)
			{
				if(j != 0) str += ',<br>';
				if(req[j][1]()) str += '<span style="color: green; font-weight: bold">';
				else str += '<span style="color: red; font-weight: bold">';
				str += req[j][0];
				if(!req[j][1]() && req[j].length >= 3) str += '(' + req[j][2][0] + '/' + req[j][2][1] + ')';
				str += '</span>';
			}
		}
		else
		{
			str += buyables[id].description + '<br>';
			if(buyables[id].effect != null) str += '效果：' + buyables[id].effD(player.buyables[id]) + '→' + buyables[id].effD(player.buyables[id].add(1)) + '<br>';
			str += '价格：' + format(buyables[id].cost(player.buyables[id])) + '<br>';
		}
		str += '</div>'
		return str;
	},
	buy(id){
		if(!buyables[id].capped() && this.lock(id).unlocked && buyables[id].canAfford(player.buyables[id]))
		{
			buyables[id].buy(player.buyables[id]);
			player.buyables[id] = player.buyables[id].add(1);
		}
	},
};

export {upgrades, buyables};