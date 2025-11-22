import { Garden } from '@/core/pt/garden';
import { player } from '@/core/save';
import { format, formatLaTeX } from '@/utils/format';
import { VueLatex } from 'vatex';

export default function () {
	return (
		<>
			<div
				style={{
					transform: 'scale(70%)',
					marginTop: '-25px',
				}}
			>
				<VueLatex
					displayMode={true}
					expression={`P=\\sqrt[4]{\\frac{${format(player.garden.totalIdea)}}{1000000}}`}
				/>
			</div>
		</>
	);
}
