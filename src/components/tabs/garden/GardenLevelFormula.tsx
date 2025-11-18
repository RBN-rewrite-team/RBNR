import { Garden } from '@/core/pt/garden';
import { player } from '@/core/save';
import { formatLaTeX } from '@/utils/format';
import { VueLatex } from 'vatex';

export default function () {
	return (
		<>
			<div
				style={{
					transform: 'scale(50%)',
					marginTop: '-25px',
				}}
			>
				<VueLatex
					displayMode={true}
					expression={`L=\\sqrt{\\log_{10}({${formatLaTeX(player.garden.bestIdea)}\\times${formatLaTeX(
						player.garden.bestInspiration,
					)}^2\\times${formatLaTeX(player.garden.trueBestEntropy)}^2})}`}
				/>
			</div>
		</>
	);
}
