<script lang="ts" setup>
import { player } from '@/core/global.ts';
import { formatWhole } from '@/utils/format';
import { isDeveloper } from '@/core/save/testing';

import { nextPage } from './page-controller';
import helpNavigator from './help-navigator';
import HelpContent from './HelpContent';

//window.nextPage = nextPage
</script>

<template>
	<div class="main">
		<helpNavigator />
		<div>
			<HelpContent />
			<div v-if="player.help.epsilon && player.help.page == 5">
				下面我们考虑<vue-latex expression="\alpha" />到<vue-latex
					expression="\omega^\alpha"
				/>的映射，这实际上就是从下方增加一层指数塔的映射
				<vue-latex expression="\alpha\mapsto \omega^\alpha" display-mode />
				从0开始重复作用上述映射，所得到的极限就是<vue-latex
					expression="\varepsilon_0"
				/>，它以这个映射过程得到的各项作为其基本列
				<vue-latex
					expression="\varepsilon_0 = \sup\left\{0, 1, \omega, \omega^\omega, \omega^{\omega^\omega}, \omega^{\omega^{\omega^\omega}}, \cdots\right\}"
					display-mode
				/>
				对<vue-latex expression="\varepsilon_0" />继续映射<vue-latex
					expression="\alpha\mapsto \omega^\alpha"
				/>，我们得到
				<vue-latex
					expression="\omega^{\varepsilon_0} = \sup\left\{1, \omega, \omega^\omega, \omega^{\omega^\omega}, \omega^{\omega^{\omega^\omega}}, \omega^{\omega^{\omega^{\omega^\omega}}}, \cdots\right\} = \varepsilon_0"
					display-mode
				/>
				因此<vue-latex expression="\varepsilon_0" />是映射<vue-latex
					expression="\alpha\mapsto \omega^\alpha"
				/>的第一个不动点
				<vue-latex
					expression="\varepsilon_0 = \mathrm{1st}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}"
					display-mode
				/>
				其中，fp.是不动点(Fixed Point)的缩写<br />
				我们称<vue-latex expression="\varepsilon_0" />为SCO(Small Cantor
				Ordinal)，由于<vue-latex expression="\varepsilon_0" />已经是<vue-latex
					expression="\alpha\mapsto \omega^\alpha"
				/>的不动点，继续进行该操作不会有任何作用。<br />
				不过，我们并非无法继续，只需要将<vue-latex
					expression="\varepsilon_0"
				/>取后继，得到<vue-latex expression="\varepsilon_0+1" />，就跳出了映射<vue-latex
					expression="\alpha\mapsto \omega^\alpha"
				/>的不动点。<br />
				继续对<vue-latex expression="\varepsilon_0+1" />进行映射<vue-latex
					expression="\alpha\mapsto \omega^\alpha"
				/>，我们可以得到一个序数序列，它的极限是<vue-latex expression="\varepsilon_1" />
				<vue-latex
					expression="\varepsilon_1 = \sup\left\{0, 1, \varepsilon_0, \omega^{\varepsilon_0+1}, \omega^{\omega^{\varepsilon_0+1}}, \omega^{\omega^{\omega^{\varepsilon_0+1}}}, \cdots\right\}"
					display-mode
				/>
			</div>
			<div v-else-if="player.help.epsilon && player.help.page == 6">
				类似于<vue-latex expression="\varepsilon_0" />，<vue-latex
					expression="\varepsilon_1 = \omega^{\varepsilon_1}"
				/><br />
				因此<vue-latex expression="\varepsilon_1" />是映射<vue-latex
					expression="\alpha\mapsto \omega^\alpha"
				/>的第二个不动点，记作
				<vue-latex
					expression="\varepsilon_1 = \mathrm{2nd}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}"
					display-mode
				/>
				或者我们也可以说，<vue-latex expression="\varepsilon_1" />是紧随于<vue-latex
					expression="\varepsilon_0"
				/>之后，映射<vue-latex
					expression="\alpha\mapsto \omega^\alpha"
				/>的第二个不动点，我们将其记为
				<vue-latex
					expression="\varepsilon_1 = \alpha\mapsto \omega^\alpha\textrm{ fp. aft } \varepsilon_0"
					display-mode
				/>
				这里，aft是在......之后(after)的意思<br />
				类似的，通过重复上述过程，我们得到
				<vue-latex
					expression="\begin{aligned}
            \varepsilon_2 &= \sup\left\{0, 1, \varepsilon_1, \omega^{\varepsilon_1+1}, \omega^{\omega^{\varepsilon_1+1}}, \omega^{\omega^{\omega^{\varepsilon_1+1}}}, \cdots\right\}\\
                &= \mathrm{3rd}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}\\
                &= \alpha\mapsto \omega^\alpha\textrm{ fp. aft } \varepsilon_1
            \end{aligned}"
					display-mode
				/>
				<vue-latex
					expression="\begin{aligned}
            \varepsilon_3 &= \sup\left\{0, 1, \varepsilon_2, \omega^{\varepsilon_2+1}, \omega^{\omega^{\varepsilon_2+1}}, \omega^{\omega^{\omega^{\varepsilon_2+1}}}, \cdots\right\}\\
                &= \mathrm{4th}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}\\
                &= \alpha\mapsto \omega^\alpha\textrm{ fp. aft } \varepsilon_2
            \end{aligned}"
					display-mode
				/>
				在所有的<vue-latex expression="\varepsilon_n" />，对所有的这些序数取上确界，得到
				<vue-latex
					expression="\begin{aligned}
            \varepsilon_\omega &= \sup\left\{\varepsilon_0, \varepsilon_1, \varepsilon_2, \varepsilon_3, \cdots\right\}\\
                &= \omega\mathrm{th}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}\\
            \end{aligned}"
					display-mode
				/>
				重复上述取不动点和取下标极限的操作，我们可以得到所有的<vue-latex
					expression="\varepsilon"
				/>序数。
			</div>
			<div v-else-if="player.help.epsilon && player.help.page == 7">
				下面我们递归地给出<vue-latex expression="\varepsilon" />序数的基本列<br />
				1. <vue-latex expression="\omega[n] = n" /><br />
				2. <vue-latex expression="(\alpha+\beta)[n] = \alpha+\beta[n]" />，其中<vue-latex
					expression="\beta"
				/>是极限序数<br />
				3. <vue-latex expression="\omega^{\alpha+1}[n] = \omega^\alpha\cdot n" /><br />
				4. <vue-latex expression="\omega^\alpha[n] = \omega^{\alpha[n]}" />，其中<vue-latex
					expression="\alpha"
				/>是极限序数<br />
				5.
				<vue-latex
					expression="\varepsilon_0[0] = 0, \varepsilon_0[n+1] = \omega^{\varepsilon_0[n]}"
				/><br />
				6.
				<vue-latex
					expression="\varepsilon_{\alpha+1}[0] = \varepsilon_\alpha+1, \varepsilon_{\alpha+1}[n+1] = \omega^{\varepsilon_{\alpha+1}[n]}"
				/><br />
				7.
				<vue-latex
					expression="\varepsilon_{\alpha}[n] = \varepsilon_{\alpha[n]}"
				/>，其中<vue-latex expression="\alpha" />是极限序数<br />
				我们将对<vue-latex expression="\varepsilon_{\varepsilon_0}"></vue-latex
				>进行基本列展开，每一次展开四列。 1.
				<vue-latex expression="\varepsilon_{\varepsilon_0}[4]"></vue-latex><br />
				2. <vue-latex expression="\varepsilon_{\varepsilon_0[4]}"></vue-latex><br />
				3. <vue-latex expression="\varepsilon_{\omega^{\varepsilon_0[3]}}"></vue-latex
				><br />
				4.
				<vue-latex expression="\varepsilon_{\omega^{\omega^{\varepsilon_0[2]}}}"></vue-latex
				><br />
				5.
				<vue-latex
					expression="\varepsilon_{\omega^{\omega^{\omega^{\varepsilon_0[1]}}}}"
				></vue-latex
				><br />
				6.
				<vue-latex
					expression="\varepsilon_{\omega^{\omega^{\omega^{\omega^{\varepsilon_0[0]}}}}}"
				></vue-latex
				><br />
				7.
				<vue-latex
					expression="\varepsilon_{\omega^{\omega^{\omega^{\omega^{0}}}}}"
				></vue-latex
				><br />
				8. <vue-latex expression="\varepsilon_{\omega^{\omega^{\omega^{1}}}}"></vue-latex
				><br />
				9. <vue-latex expression="\varepsilon_{\omega^{\omega^{\omega}}}"></vue-latex><br />
				10. <vue-latex expression="\varepsilon_{\omega^{\omega^{4}}}"></vue-latex><br />
				11. <vue-latex expression="\varepsilon_{\omega^{\omega^{3}4}}"></vue-latex><br />
				12.
				<vue-latex
					expression="\varepsilon_{\omega^{\omega^{3}3+\omega^{2}3+\omega3+4}}"
				></vue-latex
				><br />
			</div>
			<div v-else-if="player.help.epsilon && player.help.page == 8">
				下面我们考虑<vue-latex expression="\alpha\mapsto\varepsilon_\alpha"></vue-latex
				>的映射。<br />
				从0开始重复作用上述映射，所得到的极限就是<vue-latex expression="\zeta_0"></vue-latex
				>，它的基本列是<br />
				<vue-latex
					expression="\zeta_0 = \sup\left\{0, \varepsilon_0, \varepsilon_{\varepsilon_0}, \varepsilon_{\varepsilon_{\varepsilon_0}}, \cdots\right\}"
					display-mode
				/>
				不难发现，<vue-latex expression="\zeta_0 = \varepsilon_{\zeta_0}"></vue-latex
				>，所以我们也可以像ε序数操做它：
				<vue-latex
					expression="\varepsilon_{\zeta_0+1} = \sup\left\{0, 1, \zeta_0, \omega^{\zeta_0+1}, \omega^{\omega^{\zeta_0+1}}, \omega^{\omega^{\omega^{\zeta_0+1}}},\cdots\right\}"
					display-mode
				></vue-latex>
				那么问题来了，<vue-latex expression="\zeta_1"></vue-latex>是什么？<br />
				<vue-latex
					expression="\begin{aligned}
        \zeta_1 &= \alpha\mapsto \varepsilon_\alpha\textrm{ fp. aft } \zeta_0\\
        &=\sup\left\{\zeta_0+1,\varepsilon_{\zeta_0+1},\varepsilon_{\varepsilon_{\zeta_0+1}},\cdots\right\}
        \end{aligned}
        "
					display-mode
				></vue-latex>
				<vue-latex
					expression="\begin{aligned}
        \zeta_2 &= \alpha\mapsto \varepsilon_\alpha\textrm{ fp. aft } \zeta_1\\
        &=\sup\left\{\zeta_1+1,\varepsilon_{\zeta_1+1},\varepsilon_{\varepsilon_{\zeta_1+1}},\cdots\right\}
        \end{aligned}
        "
					display-mode
				></vue-latex>
				可以整理出以下基本列展开方法：<br />
				1.<vue-latex expression="\zeta_0[0] = 0" /><br />
				2.<vue-latex expression="\zeta_0[n+1] = \varepsilon_{\zeta_0[n]}" /><br />
				3.<vue-latex expression="\alpha"></vue-latex>为极限序数，<vue-latex
					expression="\zeta_\alpha[n] = \zeta_{\alpha[n]}"
				/><br />
				4.<vue-latex
					expression="\zeta_{\alpha+1} = \beta\mapsto\varepsilon_\beta\textrm{ fp. aft } \zeta_{\alpha}"
				></vue-latex
				><br />
			</div>
			<div v-else-if="player.help.epsilon && player.help.page == 9">
				下面我们考虑<vue-latex expression="\alpha\mapsto\zeta_\alpha"></vue-latex
				>的映射。<br />
				从0开始重复作用上述映射，所得到的极限就是<vue-latex expression="\eta_0"></vue-latex
				>，基本列<br />
				<vue-latex
					expression="\eta_0 = \sup\left\{0, \zeta_0, \zeta_{\zeta_0}, \zeta_{\zeta_{\zeta_0}}, \cdots\right\}"
					display-mode
				/>
				<vue-latex expression="\eta_0 = \varepsilon_{\eta_0} = \zeta_{\eta_0} "></vue-latex
				>， 基本列展开方法和<vue-latex expression="\zeta_\alpha"></vue-latex>相似，<br />
				1.<vue-latex expression="\eta_0[0] = 0" /><br />
				2.<vue-latex expression="\eta_0[n+1] = \zeta_{\eta_0[n]}" /><br />
				3.<vue-latex expression="\alpha"></vue-latex>为极限序数，<vue-latex
					expression="\eta_\alpha[n] = \eta_{\alpha[n]}"
				/><br />
				4.<vue-latex
					expression="\eta_{\alpha+1} = \beta\mapsto\zeta_\beta\textrm{ fp. aft } \eta_{\alpha}"
				></vue-latex
				><br />
				到这里我们能发现这些规则和<vue-latex
					expression="\varepsilon_\alpha, \zeta_\alpha, \eta_\alpha"
				></vue-latex
				><br />
				很相似。在各种各样的序数映射之下，不动点的结构可以变得非常复杂。<br />假如我们利用数阵型记号对不动点的层次结构进行标记，那么我们将得到Veblen函数。<br />
				最简单的Veblen 函数是只包含一个序数变量<vue-latex
					expression="\alpha"
				/>的一元Veblen函数<vue-latex expression="\varphi(\alpha)" />，<br />
				它实际上就等于<vue-latex expression="\omega^\alpha" /><br />
				接下来有二元Veblen函数<vue-latex expression="\varphi(\alpha,\beta)"></vue-latex
				>。<br />
				1. <vue-latex expression="\varphi(0,\alpha)=\varphi(\alpha)"></vue-latex><br />
				2.
				<vue-latex
					expression="\varphi(\alpha+1,0)=\beta\mapsto\varphi(\alpha,\beta)\textrm{ fp.}"
				></vue-latex
				><br />
				3.
				<vue-latex
					expression="\varphi(\alpha+1,\beta+1)=\gamma\mapsto\varphi(\alpha,\gamma)\textrm{ fp. }\varphi(\alpha+1,\beta)"
				></vue-latex
				><br />
				4. 对于任意极限序数<vue-latex
					expression="\alpha, \varphi(\alpha,\beta+1)=\sup\{\varphi(\gamma,\varphi(\alpha,\beta)+1)|\gamma<\alpha\}"
				></vue-latex
				><br />
				5. 对于任意极限序数<vue-latex expression="\gamma"></vue-latex>, 有<vue-latex
					expression="\varphi(\gamma, 0) = \sup\{\varphi(\beta, 0)|\beta<\gamma\}"
				></vue-latex
				>。<br />
				例如<vue-latex
					expression="\varphi(1,0) = \beta\mapsto\omega^{\beta} \textrm{ fp.} = \varepsilon_0"
				></vue-latex
				>,<br />
				<vue-latex
					expression="\varphi(1,1) = \gamma\mapsto\omega^\gamma\textrm{ fp. }\varphi(1,0) = \varepsilon_1"
				></vue-latex
				>,<br />
				我们可以推导出<vue-latex
					expression="\varphi(1,\alpha) = \varepsilon_\alpha"
				></vue-latex
				>，同样的，<vue-latex expression="\varphi(2,\alpha) = \zeta_\alpha"></vue-latex
				>，<vue-latex expression="\varphi(3,\alpha) = \eta_\alpha"></vue-latex>。<br />
			</div>
			<div v-else-if="player.help.epsilon && player.help.page == 10">
				接下来定义一个序数,<vue-latex
					expression="\Gamma_0 = \alpha\mapsto\varphi(\alpha,0)\textrm{ fp.} = \varphi(1,0,0)"
				></vue-latex>
				这里的<vue-latex expression="\varphi"></vue-latex>函数是一个多元函数。<br />
				有以下规则:<br />
				1. n为非0有限序数<vue-latex
					expression="\varphi(\#,n+1,\alpha+1)=\beta\mapsto\varphi(\#,n,\beta) \mathrm{ fp. aft }\varphi(\#,n+1,\alpha)"
				></vue-latex
				><br />
				2.
				<vue-latex
					expression="\varphi(\#,\alpha+1,0,\mathrm{O}, 0)=\beta\mapsto\varphi(\#,\alpha, \beta,\mathrm{O},0)\mathrm { fp. }"
				></vue-latex
				><br />
				3.
				<vue-latex
					expression="\varphi(\#,\alpha+1,0,\mathrm{O}, \gamma+1)=\beta\mapsto\varphi(\#,\alpha, \beta,\mathrm{O},0)\mathrm { fp. aft}\varphi(\#, \alpha+1, 0, \mathrm{O}, \gamma)"
				></vue-latex
				><br />
				4.
				<vue-latex
					expression="\varphi(\#,\beta, \#,\alpha+1) = \sup{\varphi(\#,\gamma,\#,\varphi(\#,\beta,\#,\alpha)+1)|\gamma<\beta}"
				></vue-latex>
				(此处规则不全， 待补充)
				<br />
				在<vue-latex expression="\Gamma_0"></vue-latex>后，还有Ackermann 序数
				<vue-latex expression="\varphi(1,0,0,0)"></vue-latex>。<br />
				我们可以把<vue-latex expression="\varphi"></vue-latex>函数扩展到任意有限元。
			</div>
			<div v-else-if="player.help.page == 101">
				序数折叠函数(OCF)，用另一种方式来枚举不动点。<br />
				其定义涉及集合论，但行为逻辑可以用非常简单的形式归纳。<br />
				它的基本形式是<vue-latex
					expression="\psi(0)=\omega"
				/>，其中的参数每增加1都会让序数乘以<vue-latex expression="\omega" /><br />
				根据上一条定义，能表达的最大序数是<vue-latex expression="\varepsilon_0" />。<br />
				随后OCF引入了<vue-latex
					expression="\Omega"
				/>，它是第一个非递归序数(或者第一个容许序数)。它在OCF的作用是在OCF的参数末尾的<vue-latex
					expression="\Omega"
				/>带来一个<vue-latex expression="\Omega" />前运算的不动点。<br />
				<vue-latex expression="\psi(0)=\omega" /><br />
				<vue-latex expression="\psi(X+1)=\psi(X)\cdot\omega" /><br />
				<vue-latex
					expression="\psi(X*\Omega)=\alpha\mapsto\psi(X*\alpha)FP"
				/>(其中*为加法、乘法、乘方之一)<br />
				<vue-latex expression="\psi(\sup\ \alpha[n \in N^+])[n]=\psi(\alpha[n])" /><br />
				以上四条规则构成了一个基本的OCF，它的极限<vue-latex
					expression="\psi(\varepsilon_{\Omega+1})"
				/>相当于Veblen函数的极限——BHO。<br />
				稍微修改一下规则，可以炮制出一批这样的OCF。<br />
				例如，对于第二个非递归序数<vue-latex expression="\Omega_2" />，只需要将<vue-latex
					expression="\psi(0)"
				/>改成<vue-latex expression="\Omega" />，然后将第三条的<vue-latex
					expression="\Omega"
				/>改成<vue-latex expression="\Omega_2" />。<br />
				为了区分，这种OCF表示为<vue-latex
					expression="\psi_{\Omega_2}(X)"
				/>，它输出<vue-latex expression="\Omega" />的各种不动点。<br />
				随后，将这个新的OCF的输出结果套入原来的OCF中，极限就被扩展了。<br />
				为了简化，如果存在<vue-latex expression="\Omega_{X}" />，则<vue-latex
					expression="\psi(X*\Omega_{X})=\psi(\psi_{\Omega_X}(X*\Omega_X))"
				/><br />
				除了<vue-latex expression="\psi_{\Omega_2}(X)" />，还有<vue-latex
					expression="\psi_{\Omega_3}(X)"
				/>，<vue-latex expression="\psi_{\Omega_4}(X)" />......<br />
				<vue-latex expression="\Omega_\omega=\sup \Omega_{\omega[n]}" /><br />
				将其放入OCF中得到的序数是很多记号的极限，也是FGH和SGH的第一个追平点，称为BO。自BO以后，序数分析步入了反射序数时代。<br />
				<!-- 需要注意的是容许序数和非递归序数是有区别的，<br />
        事实上，这个分歧点在稳定序数<vue-latex expression="\lambda \alpha.(\Omega_{\alpha+1})-\Pi_1" />附近，后面的序数可能会有<vue-latex expression="\omega^{\mathrm{CK}}_{\alpha+1} \not=\Omega_{\alpha+1}" />这种神秘现象，这被称为Non-Gandy现象，目前我们并不用管它。<br /> -->
			</div>
			<div v-else-if="player.help.page == 102">
				经过简单的扩展，OCF可以在BO以上继续提升，但这样的提升收效甚微，此处暂且不表。<br />
				任意递归序数层级的OCF的极限是<vue-latex
					expression="\psi(\Omega_\Omega)=\alpha\mapsto\psi(\Omega_\alpha)FP"
				/>，它是扩展鸟之记号的极限，被称为BIO。<br />
				显然可以通过一个更高层的序数来折叠这一过程，因此OCF引入了递归不可达序数，第一个这种序数是<vue-latex
					expression="I"
				/>。<br />
				关于它的OCF的定义与<vue-latex expression="\Omega_X" />类似，但<vue-latex
					expression="\psi_I(X)=\Omega_X"
				/>，因此<vue-latex
					expression="\psi(I)=\psi(\alpha\mapsto\Omega_{\alpha}FP)"
				/>。<br />
				<vue-latex expression="\psi(I)" />被称为扩展BO，也就是EBO，它是单独使用<vue-latex
					expression="\Omega"
				/>的OCF的最终极限。<br />
				需要注意的是<vue-latex expression="I" />并不能表示为<vue-latex
					expression="\beta\mapsto\Omega_\beta"
				></vue-latex
				>不动点，而是容许点（AP），一个容许序数作为不动点时就是容许点。<br />
				容许序数不能用比它更小的序数进行递归运算得到。<br />
				例如<vue-latex expression="\Omega_1"></vue-latex>就无法用比<vue-latex
					expression="\Omega_1"
				></vue-latex
				>更小的序数递归得到。每个<vue-latex expression="\Omega_{\beta+1}"></vue-latex
				>都是容许序数（<vue-latex expression="\Omega_\omega"></vue-latex
				>并不是容许序数）。<br />
				在<vue-latex expression="I" />之上，还可以定义关于更高的递归不可达序数<vue-latex
					expression="I_X"
				/>的OCF，它的对应规则是<vue-latex
					expression="\psi_{I_{X+1}}(Y)=\Omega_{I_X+Y}"
				/>。<br />
				折叠这些OCF的序数是<vue-latex expression="I(1,0)" />，<vue-latex
					expression="\psi_{I(1,0)}(X)=I_X"
				/><br />
				如此，使用Veblen函数的表示法，可以表达最高<vue-latex
					expression="\psi_{I(1@(1@(...)))}"
				/>的序数，它相当于BMS的<vue-latex
					expression="(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(5,2,0)"
				/>，被称为SRO。<br />
				我们可以用一个更高层次的OCF来折叠<vue-latex
					expression="I(a,b,c...)"
				/>及其序数元、<vue-latex expression="@(1,0)" />变体，它就是<vue-latex
					expression="M"
				/>。<br />
				<vue-latex expression="M" />是在<vue-latex
					expression="M"
				/>以下无法通过取若干次容许点而得到的序数，我们把之前的容许点运算成为1-容许点，把类似于容许点的马洛点成为2-容许点，只有一个不动点本身是马洛序数时才能被称为马洛点。<br />
				<vue-latex expression="\psi_M(X)=\Omega_X" /><br />
				<vue-latex
					expression="\psi_M(X*M)=\alpha\mapsto\psi_M(X*\alpha)AP"
				/>(其中*为加法、乘法、乘方之一)<br />
				<vue-latex
					expression="\psi_M(\sup\ \alpha[n \in N^+])[n]=\psi_M(\alpha[n])"
				/><br />
				例如<vue-latex
					expression="\psi_M(M)=\beta\mapsto\Omega_\beta \mathrm{ ap.}=I"
				/><br />

				含有<vue-latex expression="M" />的OCF可以像普通OCF折叠Veblen一样折叠<vue-latex
					expression="I"
				/>的Veblen。<br />
			</div>
			<div v-else-if="player.help.page == 103">
				以下是<vue-latex expression="\psi_M"></vue-latex>函数的例子<br />
				<vue-latex expression="\psi_M(M)=I" display-mode />
				<vue-latex expression="\psi_M(M+1)=\Omega_{I+1}" display-mode />
				<vue-latex expression="\psi_M(M2)=I_2" display-mode />
				<vue-latex expression="\psi_M(M3)=I_3" display-mode />
				<vue-latex expression="\psi_M(M\Omega)=I_\Omega" display-mode />
				<vue-latex expression="\psi_M(M^2)=I(1,0)" display-mode />
				<vue-latex expression="\psi_M(M^2+M)=I_{I(1,0)+1}" display-mode />
				<vue-latex expression="\psi_M(M^22)=I(1,1)" display-mode />
				<vue-latex expression="\psi_M(M^3)=I(2,0)" display-mode />
				<vue-latex expression="\psi_M(M^\omega)=I(\omega,0)" display-mode />
				<vue-latex expression="\psi_M(M^M)=I(1,0,0)" display-mode />
				<vue-latex expression="\psi_M(M^{M^2})=I(1,0,0,0)" display-mode />
				<vue-latex expression="\psi_M(M^{M^M})=I(1@(1,0))" display-mode />
				<vue-latex
					expression="\psi_M(\varepsilon_{M+1})=\sup\{I,I(1,0),I(1@(1,0)),I(1@(1@(1,0))),I(1@(1@(1@(1,0)))),\cdots\}"
					display-mode
				/>
			</div>
			<div v-else-if="player.help.page == 104">
				有<vue-latex expression="\Omega"></vue-latex>有<vue-latex
					expression="\Omega_2"
				></vue-latex
				>，有M也有<vue-latex expression="M_2"></vue-latex>。<br />
				通过取马洛序数的不动点，我们得到<vue-latex
					expression="M(1,0)"
				/>，之后通过同样的Veblen系统得到一个马洛序数的BHO。<br />
				达到了新的BHO之后，根据以往的经验，我们可以用一个更强的马洛OCF来折叠普通马洛序数的一系列OCF。<br />
				这样的OCF的基本规则是<vue-latex expression="\psi_M(1;0)(X)=M_X" />。<br />
				同样的，也会有<vue-latex expression="M(2;0)" />，<vue-latex
					expression="M(3;0)"
				/>，<vue-latex expression="M(1,0;0)" />直到一个马洛点的BHO。<br />
				这个高层的Veblen结构以<vue-latex
					expression="\psi_N(X*N)=\alpha\mapsto\psi_N(X*\alpha)MP"
				/>来折叠，MP表示马洛点。<br />
				<vue-latex expression="N" />是不可转换序数，它对应的容许点称为3-容许点。<br />
				于是，以这样的Veblen+OCF不断互相左脚踩右脚上天的形式，可以得到形形色色乱七八糟的折叠结构，进行梳理之后可以得到反射序数系统。<br />
				我们可以继续：4-容许点, 5-容许点, ..., ω-容许点, ...
				直到容许点左边的序数取容许点，写成容许点-容许点，对应的序数<b><i>有可能是</i></b
				>弱紧致序数，<vue-latex expression="K" />。<br />
			</div>
			<!--TODO: 忘记做aft了-->
			<div v-else-if="player.help.page == 105">
				<p>
					反射序数有深刻的集合论背景，包括但不限于<vue-latex
						expression="\Delta_0, \Pi_\alpha, \Sigma_\alpha"
					/>公式，可构造宇宙等。
				</p>
				<p>
					反射序数有一些符号:
					<vue-latex
						expression="n\mathrm{th}, \operatorname{onto}, \cap, \Pi_\alpha, \mathrm{Ord}, \operatorname{aft}"
					/>
				</p>
				<p><vue-latex expression="n\mathrm{th} X" />是X的第几个序数</p>
				<p>
					<vue-latex expression="\Pi_\alpha\mathrm{onto} X" />是
					取出所有X中的序数，满足反射公式<vue-latex expression="\Pi_alpha" />。
				</p>
				<p>
					<vue-latex
						expression="\cap"
					/>是集合的交集运算,也就是取出两个集合中都有的元素，合成为一个集合。
				</p>
				<p>
					<vue-latex
						expression="\mathrm{xth} Y \operatorname{aft} X"
					/>是X在Y集合中后的第x个序数
				</p>
				<p><vue-latex expression="\Pi_\alpha" />是公式，具体是什么公式暂时难以所清楚</p>
				<p>
					<vue-latex
						expression="\mathrm{Ord}=\{0,1,2,\cdots,\omega,\omega+1,\cdots,\Omega,\cdots,\omega_1,\cdots\}"
					/>是所有序数组成的类。
				</p>
				<p>
					之前前人证明过，<vue-latex expression="\Pi_0\operatorname{onto}X" />和<vue-latex
						expression="\Pi_1\operatorname{onto}X"
					/>是取出X中的所有极限点。
				</p>
				<p>
					例如<vue-latex
						expression="\Pi_1\operatorname{onto}\mathrm{Ord}"
					/>就是取出序数的所有极限点，等于<vue-latex
						expression="\lbrace\omega,\omega\cdot2,\omega\cdot3,\cdots,\omega^2,\cdots\rbrace"
					/>
				</p>
				<p>
					<vue-latex
						expression="2\mathrm{nd}\Pi_1\operatorname{onto}\mathrm{Ord}"
					/>就是取出这个集合的第二个序数，等于<vue-latex expression="\omega\cdot2" />
				</p>
				<p>
					我们可以继续计算<vue-latex
						expression="\Pi_1\operatorname{onto}\Pi_1\operatorname{onto}\mathrm{Ord}"
					/>就是取出<vue-latex
						expression="\Pi_1\operatorname{onto}\mathrm{Ord}"
					/>的所有极限点，等于<vue-latex
						expression="\lbrace\omega^2,\omega^2\cdot2,\omega^2\cdot3,\cdots,\omega^3,\cdots\rbrace"
					/>
				</p>
				<p>
					<vue-latex
						expression="\Pi_1\operatorname{onto}\Pi_1\operatorname{onto}\mathrm{Ord}"
					/>这个形式太麻烦，我们可以写成<vue-latex
						expression="1-1-\mathrm{Ord}"
					/>或<vue-latex expression="1-1" />
				</p>
				<p>
					把1-重复写，可以得到
					<vue-latex expression="1-1-\cdots-1" />，等于<vue-latex
						expression="\omega^\omega"
					/>，把1-简写成<vue-latex expression="(1-)^\alpha" />,比如说<vue-latex
						expression="1-1-\cdots-1=(1-)^\omega1=\omega^\omega"
					/>
				</p>
				<p>进一步，可以有</p>
				<vue-latex display-mode expression="(1-)^{\omega^2}1=\omega^{\omega^2}"></vue-latex>
				<vue-latex
					display-mode
					expression="(1-)^{(1-)^{\omega}}1=\omega^{\omega^\omega}"
				></vue-latex>
				<p>
					这个三角形的指数塔可以不断延续下去，直到无穷层。利用 Veblen
					函数的不动点模式，我们将其记为
				</p>
				<vue-latex
					display-mode
					expression="\mathrm{1st}(1-)^{(1,0)}1=\mathrm{1st}\{\varepsilon_0, \varepsilon_1, \varepsilon_2,\cdots\}=\varphi(1,0)"
				></vue-latex>
				<vue-latex display-mode expression="(1-)^{(1,1)}1=\varepsilon_\omega"></vue-latex>
				<vue-latex display-mode expression="(1-)^{(2,0)}1=\zeta_0"></vue-latex>
				<p>
					我们发现我们还在走Velben函数的旅程，所以我们使用<vue-latex
						expression="\Pi_2"
					/>反射序数。
				</p>
				<!--部分内容取自大数理论20250915 P372-->
			</div>
			<div v-else-if="player.help.page == 106">
				<p>
					之前前人证明过，<vue-latex
						expression="\Pi_2\operatorname{onto}X"
					/>是取出X中的所有容许点。
				</p>
				<p>
					例如<vue-latex
						expression="\Pi_2\operatorname{onto}\mathrm{Ord}=\{\Omega, \Omega_2, \cdots, \Omega_{\omega+1}, \cdots,\Omega_{\omega2+1}, \cdots, \Omega_{\Omega+1}, \cdots, \psi_I(I+1), \cdots, I, \cdots\}"
					/>就是取出序数中的所有容许序数
				</p>
				<p>
					需要注意<vue-latex
						expression="\Omega_\omega, \Omega_\Omega,\psi_I(I)"
					/>并不是容许序数，因为他们可以由下面的序数自下到上得到，也就是说他们的基本列长度不等于自身，这一点前文也提到过。
				</p>
				<p>接下来可以继续迭代：</p>
				<vue-latex
					display-mode
					expression="1-1-2 = \{\Omega_{\omega^2},\Omega_{\omega^22},\cdots,\Omega_{\Omega},\cdots,I,\cdots\}"
				/>
				<vue-latex
					display-mode
					expression="(1-)^{\omega}2 = \{\Omega_{\omega^\omega},\cdots,\Omega_{\Omega},\cdots,I,\cdots\}"
				/>
				<vue-latex
					display-mode
					expression="\mathrm{1st} (1-)^{\Omega}2 = \Omega_{\Omega}"
				/>
				<vue-latex
					display-mode
					expression="2\space\mathrm{aft} (1-)^{\Omega}2 = \Omega_{\Omega+1}"
				/>
				<vue-latex
					display-mode
					expression="\mathrm{1st} (1-)^{(1-)^{\Omega}2}2 = \Omega_{\Omega_{\Omega}}"
				/>
				<vue-latex
					display-mode
					expression="\mathrm{1st} (1-)^{(1,0)}2 = \psi_I(I) = \alpha\mapsto(1-)^\alpha2\space\mathrm{fp.}"
				/>
				<p>
					我们上述得到的<vue-latex
						expression="(1-)^\alpha2"
					/>集合里的序数都是非容许序数。我们想问，是否有一个序数既是容许序数，也是容许序数集合的容许点里的序数？
				</p>
				<p>
					这个序数就是前文提过的<vue-latex
						expression="\beta\mapsto\Omega_\beta\mathrm{ap.}=I=2\space1-2=\Pi_2\cap(\Pi_1\operatorname{onto}\Pi_2)"
					/>
				</p>
			</div>
		</div>
	</div>
</template>
