import { enterTheCardinalWorldTrigger as failedTrigger, player } from '@/core/save';
import { isDeveloper } from '@/core/save/testing';
import ModalService from '@/utils/Modal';
import { getMessage, i18n } from '@/utils/i18n';

export function activateTheDoorOfCardinal() {
	ModalService.show({
		title: getMessage("card.warn"),
		content:
			getMessage("card.desc1"),
		onConfirm(values) {
			ModalService.show({
				title: getMessage("card.warn"),
				content:
					getMessage("card.desc2"),
				onConfirm(values) {
					// player.thedoorofcardinalstate = true;
					if (!isDeveloper())
						return ModalService.show({
							content: 'blocked by developer',
						});
					if (player.retribution != 4) {
						ModalService.show({
							title: getMessage("card.ultimatum"),
							content:
								getMessage("card.desc3", {
								  verify: getMessage("card.verify")
								}),
							fields: [
								{
									type: 'input',
									validation: new RegExp(getMessage("card.verify")),
								},
							],
							onConfirm(values) {
								player.thedoorofcardinalstate = true;
								player.thedoorofcardinaltime = Date.now();
							},
							confirmText: 'ADVANCE',
							cancelText: 'I give up',
							dangerous: true
						});
					} else
						((player.thedoorofcardinalstate = true),
							(player.thedoorofcardinaltime = Date.now()));
				},
				cancelText: "It's too dangerous",
				dangerous: true
			});
		},
		cancelText: "It's too dangerous",
		dangerous: true
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
		player.withinCardinal = true;
	}
}
