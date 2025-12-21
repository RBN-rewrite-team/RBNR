import { player } from "@/core/save";
import ModalService from "@/utils/Modal";

export function activateTheDoorOfCardinal() {
    ModalService.show({
        title: "Warning",
        content: "The Road to cardinal is dangerous, force enter may cause unknown effects. Are you sure you want to force enter?",
        onConfirm(values) {
            ModalService.show({
                title: "Warning",
                content: "Ensure confirm! The Road to cardinal is very dangerous, force enter may cause unknown effects! Are you sure you want to force enter?",
                onConfirm(values) {
                    //window.open("https://www.bilibili.com/video/BV1GJ411x7h7");
                    // player.thedoorofcardinalstate = true;
					if(player.retribution != 4)
					{
						ModalService.show({
							title: 'Ultimatum',
							content: 'This is a disclaimer. If something goes wrong, it\'s nobody\'s responsibility.',
							onConfirm(values) {
								player.thedoorofcardinalstate = true;
								player.thedoorofcardinaltime = Date.now();
							},
							confirmText: 'ADVANCE',
							cancelText: 'I give up',
						});
					}
					else player.thedoorofcardinalstate = true, player.thedoorofcardinaltime = Date.now();
                },
                confirmText: "Yes",
                cancelText: "It's too dangerous"
            });
        },
        confirmText: "Yes",
        cancelText: "It's too dangerous"
    })
    
}