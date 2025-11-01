import { player } from '../global';
import { importHydra } from './automator-modules/hydra';
import { importMath } from './automator-modules/math';
import { importMusic } from './automator-modules/music-play';
import { importNonrec } from './automator-modules/nonrec';
import { importPT } from './automator-modules/proofTheory';
import { importRbnr } from './automator-modules/rbnr';
import { parentEnvironment } from './environment';

export function tryInclude(pkg: string) {
	if (pkg == 'math') {
		importMath(parentEnvironment);
		return;
	}
	if (pkg == 'hydra' && player.upgrades['ts_auto_pkg_hydra']) {
		importHydra(parentEnvironment);
		return;
	}
	if (pkg == 'nonrec' && player.upgrades['ts_auto_pkg_nonrec']) {
		importNonrec(parentEnvironment);
		return;
	}
	if (pkg == 'proofTheory' && player.milestones.pt_7) {
		importPT(parentEnvironment);
		return;
	}
	if (pkg == 'music') {
		importMusic(parentEnvironment);
		return;
	}
	if (pkg == 'rbnr') {
		importRbnr(parentEnvironment);
		return;
	}
	throw new ReferenceError('Cannot find package ' + pkg);
}
