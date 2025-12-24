import { enterTheCardinalWorldTrigger as failedTrigger, player } from '@/core/save';
import { isDeveloper } from '@/core/save/testing';
import ModalService from '@/utils/Modal';

export function activateTheDoorOfCardinal() {
	ModalService.show({
		title: 'Warning',
		content:
			'The Road to cardinal is dangerous, force enter may cause CRITICAL effects. Are you sure you want to force enter?',
		onConfirm(values) {
			ModalService.show({
				title: 'Warning',
				content:
					'Ensure confirm! The Road to cardinal is very dangerous, force enter may cause CRITICAL effects! Are you sure you want to force enter?',
				onConfirm(values) {
					//window.open("https://www.bilibili.com/video/BV1GJ411x7h7");
					// player.thedoorofcardinalstate = true;
					if (!isDeveloper())
						return ModalService.show({
							content: 'blocked by developer',
						});
					if (player.retribution != 4) {
						ModalService.show({
							title: 'Ultimatum',
							content:
								'This is a disclaimer. If something goes wrong, your save may be permanently lost, it\'s nobody\'s responsibility.<br /><br />If you agree this disclaimer, please input \"I agree\" on this input box.',
							fields: [
								{
									type: 'input',
									validation: /I agree/,
								},
							],
							onConfirm(values) {
								player.thedoorofcardinalstate = true;
								player.thedoorofcardinaltime = Date.now();
							},
							confirmText: 'ADVANCE',
							cancelText: 'I give up',
						});
					} else
						((player.thedoorofcardinalstate = true),
							(player.thedoorofcardinaltime = Date.now()));
				},
				confirmText: 'Yes',
				cancelText: "It's too dangerous",
			});
		},
		confirmText: 'Yes',
		cancelText: "It's too dangerous",
	});
}
export function randomNumber() {
	let a = new Uint8Array(1);
	crypto.getRandomValues(a);
	return a[0];
}

export function theDoorOfCardinalLoop() {
    if (!player.thedoorofcardinalstate) return;
    if ((Date.now()-player.thedoorofcardinaltime)>=170000 && player.thedoorofcardinalcrisis < 1) {
        let a = randomNumber();
        if (a>=86 && !isDeveloper()  && player.retribution<=1) {
            failedTrigger();
        } else {
            player.thedoorofcardinalcrisis = 1;
        }
    }
    if ((Date.now()-player.thedoorofcardinaltime)>=345000 && player.thedoorofcardinalcrisis < 2) {
        let a = randomNumber();
        if (a>=86 && !isDeveloper()  && player.retribution<=2) {
            failedTrigger();
        } else {
            player.thedoorofcardinalcrisis = 2;
        }
    }
    if ((Date.now()-player.thedoorofcardinaltime)>=666666 && player.thedoorofcardinalcrisis < 3) {
        let a = randomNumber();
		// 11451419-1981-4000-2290-283839420000
        if (player.retribution<=3 && !isDeveloper() && (
			a>=86 || player.uuid == "8d4e1ace-fb24-4963-b586-d6952ba5034f" || player.uuid=="11451419-1981-4000-2290-283839420000"
		)) {
            failedTrigger();
        } else {
            //And after that, you will enter the cardinal world.
            player.thedoorofcardinalcrisis = 3;
        }
    }
	if ((Date.now()-player.thedoorofcardinaltime)>=670000 && player.thedoorofcardinalcrisis == 3) {
		// Cardinal !!!
	}


}
