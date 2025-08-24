<script lang="ts" setup>
import { player } from "../../core/global.ts"
import {
	formatWhole,
} from '@/utils/format';

function nextPage() {
  if (player.help.page >= 4321) return //没做
  let adder = 1
  if (player.help.page >= 2125)
    player.help.milestone = Math.max(player.help.milestone, 1)
  if (player.help.page >= 3200)
    player.help.milestone = Math.max(player.help.milestone, 2)
  if (player.help.milestone == 1) adder = 2
  if (player.help.milestone == 2) adder = 3
  if (player.help.page >= 1000) player.help.page += Math.random() > (0.99 ** (player.help.page - 1000) ** 0.612881628721905905) ? -1 : adder
  else player.help.page++
  highestPage = Math.max(player.help.page, highestPage)
}

//window.nextPage = nextPage

let highestPage = 0;
</script>

<template>
  <div class="main">
    <div style="display: flex; justify-content: center; align-items: center">
      <button class="clickable_button" @click="player.help.page = Math.min(Math.max(player.help.page - 1, 1), 1000)">-</button>
      第 {{formatWhole(player.help.page)}} 页
      <button class="clickable_button" @click="nextPage()">+</button>
	  <br>
	  <button class="clickable_button" @click="player.help.page = 1">序数</button>
	  <button class="clickable_button" @click="player.help.page = 101">序数折叠函数</button>
    </div>
    <div align="center">
      <div class="center_line" />
    </div>
    <div v-if="player.help.page == 1">
    序数是数学中用来表示“顺序”的数，它扩展了我们熟悉的自然数(0, 1, 2, 3 ...)，可以表示无限序列中的位置。<br>
    序数具有以下规则：<br>
      1. 一个数的下一个数仍然是一个序数<br>
      2. 对于任意由序数构成的集合，存在一个最小的序数，它大于这集合中所有的序数。<br><br>
    上述两条规则给出了两种不同的序数，我们分别称之为后继序数和极限序数，它们的具体定义如下：<br>
      1. 对任意序数<vue-latex expression="\alpha" />，存在一个序数<vue-latex expression="\alpha'=\alpha+1" />，我们称之为后继序数。<br>
      2. 对于任意由序数构成的序数数列<vue-latex expression="\{\alpha_n\}" />，存在一个序数<vue-latex expression="\beta" />满足<vue-latex expression="\beta = \sup_n\{\alpha_n\}" /><br>
        这里，<vue-latex expression="\sup" />为上确界，它指的就是大于（或等于）集合中所有元素的最小元素。<br>
        我们称<vue-latex expression="\beta" />为极限序数，<vue-latex expression="\{\alpha_n\} = \{\alpha_0, \alpha_1, \alpha_2, \cdots\}" />称为<vue-latex expression="\beta" />的基本列，记作<vue-latex expression="\beta[n] = a_n" /><br><br>
        需要注意的是，基本列的指标默认是从 0 开始的，也就是说一个极限序数<vue-latex expression="\beta" />应当表示为
        <vue-latex expression="\beta = \sup_n\{\beta[n]\} = \sup\{\beta[0], \beta[1], \beta[2], \cdots\}" display-mode />
    现在我们就得到了构造序数的两种方法：对序数取后继，以及选取出一个序数数列并对其取极限。<br>
    0 是最小的序数，除了 0 之外，所有的序数都是以上两种情况之一。<br>
    从 0 开始，不断取后继，我们就可以得到一个自然数数列
    <vue-latex expression="\{0,1,2,3,\cdots\}" display-mode />
    这也是一个序数数列，由这一数列的上确界可以定义一个新的序数
    <vue-latex expression="\omega = \sup\{0,1,2,3,\cdots\}" display-mode />
    </div>
    <div v-if="player.help.page == 2">
    与自然数类似，序数之间也可以进行运算。对自然数之间的运算规则进行推广，我们便可以得到序数之间的运算规则<br>
      序数的加法定义为：<br>
        1. 对任意序数<vue-latex expression="\alpha" />，<vue-latex expression="\alpha+0 = \alpha" /><br>
        2. 对任意序数<vue-latex expression="\alpha, \beta" />，<vue-latex expression="\alpha+\beta' = (\alpha+\beta)'" /><br>
        3. 对任意序数<vue-latex expression="\alpha" />和极限序数<vue-latex expression="\beta" />，<vue-latex expression="\alpha+\beta = \sup\{\alpha+γ|γ<\beta\}" /><br>
      特别地，如果我们考虑的极限序数的基本列为<vue-latex expression="\beta[n]" />，那么上述第三条规则可以进一步表示为
      <vue-latex expression="a+\beta=\sup_n\{\alpha+\beta[n]\}" display-mode />
      注意，序数的加法并不满足交换律，但可以验证，序数的加法仍然满足结合律。<br>
      类似的，序数的乘法定义为：<br>
        1. 对任意序数<vue-latex expression="\alpha" />，<vue-latex expression="\alpha\cdot0 = 0" /><br>
        2. 对任意序数<vue-latex expression="\alpha, \beta" />，<vue-latex expression="\alpha\cdot\beta' = \alpha\cdot\beta+\alpha" /><br>
        3. 对任意序数<vue-latex expression="\alpha" />和极限序数<vue-latex expression="\beta" />，<vue-latex expression="\alpha\cdot\beta = \sup\{\alpha\cdotγ|γ<\beta\}" /><br>
      特别地，如果我们考虑的极限序数的基本列为<vue-latex expression="\beta[n]" />，那么上述第三条规则可以进一步表示为
      <vue-latex expression="a\cdot\beta=\sup_n\{\alpha\cdot\beta[n]\}" display-mode />
      由上述定义可知，序数的加法满足结合律和左分配律
      <vue-latex expression="(\alpha\cdot\beta)\cdotγ = \alpha\cdot(\beta\cdotγ)," display-mode />
      <vue-latex expression="\alpha\cdot(\beta+γ) = \alpha\cdot\beta+\alpha\cdotγ" display-mode />
      右分配律是不满足的，例如：
      <vue-latex expression="(\omega+1)\cdot2 = (\omega+1)+(\omega+1) = \omega+(1+\omega)+1 = \omega+\omega+1 = \omega\cdot2+1" display-mode />
      可以验证，序数的乘法同样不满足交换律<br>
      类似的，序数的指数定义为：<br>
        1. 对任意序数<vue-latex expression="\alpha" />，<vue-latex expression="\alpha^0 = 1" /><br>
        2. 对任意序数<vue-latex expression="\alpha, \beta" />，<vue-latex expression="\alpha^{\beta'} = \alpha^\beta\cdot\alpha" /><br>
        3. 对任意序数<vue-latex expression="\alpha" />和极限序数<vue-latex expression="\beta" />，<vue-latex expression="\alpha^\beta = \sup\{\alpha^γ|γ<\beta\}" /><br>
      特别地，如果我们考虑的极限序数的基本列为<vue-latex expression="\beta[n]" />，那么上述第三条规则可以进一步表示为
      <vue-latex expression="a^\beta=\sup_n\{\alpha^{\beta[n]}\}" display-mode />
      可以验证，序数指数满足如下的运算规则：
      <vue-latex expression="\alpha^{\beta+γ} = \alpha^\beta\cdot\alpha^γ," display-mode />
      <vue-latex expression="(\alpha^\beta)^γ = \alpha^{\beta\cdotγ}" display-mode />
      相比于自然数运算来说，序数运算的一个重要特征是不动点的存在。<br>
      我们称某个序数<vue-latex expression="\beta" />是<vue-latex expression="\alpha\mapsto f(\alpha)" />的不动点，指的是若将<vue-latex expression="\beta" />变换为<vue-latex expression="f(\beta)" />，有<vue-latex expression="\beta = f(\beta)" />
    </div>
    <div v-if="player.help.page == 3 && player.upgrades[58]">
      快速增长层次(Fast-Growing Hierachy, FGH)为每一个递归序数<vue-latex expression="\alpha" />指定了一个快速增长的函数<vue-latex expression="f_\alpha(n)" /><br>
      它的定义如下：<br><br>
        1. 对于任意自然数<vue-latex expression="n" />，<vue-latex expression="f_0(n) = n+1" /><br>
        2. 对于任意后继序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="f_{\alpha+1}(n) = f_\alpha^n(n)" /><br>
        3. 对于任意极限序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="f_\alpha(n) = f_{\alpha[n]}(n)" /><br><br>
      事实上，从序数到函数的映射实际上有很多种，FGH仅仅是其中使用最广泛的一种。<br>
      假如我们采用不同的迭代模式作为外壳，那么我们就可以得到其他的增长层次，<br>它们也同样可以为每个序数指定一个增长的函数。<br>
      在不同的增长层次之中，极限序数的对角化过程是完全一致的，<br>只不过是初始条件和后继序数的递推规则有所不同。<br><br>
      对于任意序数<vue-latex expression="\alpha" />，中等增长层次(Middle-Growing Hierachy, MGH), <vue-latex expression="m_\alpha(n)" />定义如下：<br>
        1. 对于任意自然数<vue-latex expression="n" />，<vue-latex expression="m_0(n) = n + 1" /><br>
        2. 对于任意后继序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="m_{\alpha+1}(n) = m_\alpha(m_\alpha(n))" /><br>
        3. 对于任意极限序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="m_\alpha(n) = m_{\alpha[n]}(n)" /><br><br>
      对于任意序数<vue-latex expression="\alpha" />，Hardy 层次(Hardy Hierachy, HH), <vue-latex expression="H_\alpha(n)" />定义如下：<br>
        1. 对于任意自然数<vue-latex expression="n" />，<vue-latex expression="H_0(n) = n" /><br>
        2. 对于任意后继序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="H_{\alpha+1}(n) = H_\alpha(n+1)" /><br>
        3. 对于任意极限序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="H_\alpha(n) = H_{\alpha[n]}(n)" /><br><br>
      对于任意序数<vue-latex expression="\alpha" />，缓慢增长层次(Slow-Growing Hierachy, SGH), <vue-latex expression="g_\alpha(n)" />定义如下：<br>
        1. 对于任意自然数<vue-latex expression="n" />，<vue-latex expression="g_0(n) = 0" /><br>
        2. 对于任意后继序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="g_{\alpha+1}(n) = g_\alpha(n)+1" /><br>
        3. 对于任意极限序数<vue-latex expression="\alpha" />和自然数<vue-latex expression="n" />，<vue-latex expression="g_\alpha(n) = g_{\alpha[n]}(n)" /><br><br>
    </div>
    <div v-if="player.help.page == 4 && player.upgrades[58]">
      我们仍然遗留了一个问题没有解决，<br>
      那就是利用不同基本列所定义的极限序数所对应的函数<vue-latex expression="f_\alpha(n) = f_{a[n]}(n)" />是不同的。<br>
      以极限序数<vue-latex expression="\omega" />为例，若取基本列为
      <vue-latex expression="\omega = \sup\{0, 1, 2, \cdots\}" />，则有
      <vue-latex expression="f_\omega(n) = f_n(n)" /><br>
      若取基本列为
      <vue-latex expression="\omega = \sup\{1, 10, 100, 1000, \cdots\}" />，则有
      <vue-latex expression="f_\omega(n) = f_{10^n}(n)" /><br>
      上述两个基本列可以给出相同的极限序数<vue-latex expression="\omega" />，但是它们所对应的函数的增长速度却并不相同。<br>
      为此，我们需要定义“标准基本列”，以便对这种情况进行规范。<br>
      但在此之前，由于形如<vue-latex expression="1+\omega=\omega" />这种结果，在讨论序数的基本列之前，我们需要先对序数进行标准化。<br>
      我们通常使用的标准形式是 Cantor 标准型，它定义为如下形式：<br>
      <vue-latex expression="\alpha = \omega^{\alpha_0}+\omega^{\alpha_1}+\cdots\omega^{\alpha_n}," display-mode />
      其中，<vue-latex expression="\alpha_0\ge a_1\ge \cdots\ge a_n" />。可以证明，任意一个序数都可以写成 Cantor 标准型。<br>
      例如，对于序数
      <vue-latex expression="\omega^{\omega^{\omega^{19728}}+\omega^{\omega}\cdot3+2}\cdot2+\omega^{\omega^3+1}+1" display-mode />
      我们可以序数乘法展开，并稍微变形，得到
      <vue-latex display-mode expression="\omega^{\omega^{\omega^{19728}}+\omega^{\omega^1}+\omega^{\omega^1}+\omega^{\omega^1}+\omega^0+\omega^0}+\omega^{\omega^{\omega^{19728}}+\omega^{\omega^1}+\omega^{\omega^1}+\omega^{\omega^1}+\omega^0+\omega^0}+\omega^{\omega^3+\omega^0}+\omega^0" />
      我们可以递归地对<vue-latex expression="\varepsilon_0" />之前的序数定义如下标准形式：<br>
        1. 0是标准形式<br>
        2. 如果<vue-latex expression="\alpha, \beta" />是标准形式<br>而且<vue-latex expression="\alpha \ge \beta" />，那么<vue-latex expression="\alpha+\beta" />是标准形式<br>
        3. 如果<vue-latex expression="\alpha" />是标准形式<br>而且<vue-latex expression="\omega^\alpha>\alpha" />，那么<vue-latex expression="\omega^\alpha" />是标准形式<br>
      容易验证，所有的自然数<vue-latex expression="n" />都是标准形式。值得注意的是，上述定义中并没有涉及序数乘法。<br>
      习惯上，我们仍然容许<vue-latex expression="\alpha\cdot n" />这样的表达式存在，作为<vue-latex expression="\underbrace{\alpha+\alpha+\cdots+\alpha}_{n\text{个}\alpha}" />的简写。<br>
      由第二条规则可知，若<vue-latex expression="\alpha" />是标准形式，n是自然数，则<vue-latex expression="\alpha\cdot n" />也是标准形式<br>
      在转换为标准形式后，我们便可以定义极限序数的标准基本列了<br>
      <vue-latex expression="\varepsilon_0" />以下极限序数的标准基本列定义为：<br>
        1. <vue-latex expression="\omega[n] = n" /><br>
        2. 对于任意序数<vue-latex expression="\alpha" />，极限序数<vue-latex expression="\beta" />，自然数<vue-latex expression="n" />，<vue-latex expression="(\alpha+\beta)[n] = \alpha+\beta[n]" /><br>
        3. 对于任意序数<vue-latex expression="\alpha" />，自然数<vue-latex expression="n" />，<vue-latex expression="\omega^{\alpha+1}[n] = \omega^\alpha\cdot n" /><br>
        4. 对于任意极限序数<vue-latex expression="\alpha" />，自然数<vue-latex expression="n" />，<vue-latex expression="\omega^\alpha[n] = \omega^{\alpha[n]}" /><br><br>
      除此之外，根据上述第二条规则，容易得出<vue-latex expression="\alpha\cdot(m+1)[n] = \alpha\cdot m+\alpha[n]" />
    </div>
    <div v-else-if="player.help.epsilon && player.help.page == 5">
      下面我们考虑<vue-latex expression="\alpha" />到<vue-latex expression="\omega^\alpha" />的映射，这实际上就是从下方增加一层指数塔的映射
      <vue-latex expression="\alpha\mapsto \omega^\alpha" display-mode />
      从0开始重复作用上述映射，所得到的极限就是<vue-latex expression="\varepsilon_0" />，它以这个映射过程得到的各项作为其基本列
      <vue-latex expression="\varepsilon_0 = \sup\left\{0, 1, \omega, \omega^\omega, \omega^{\omega^\omega}, \omega^{\omega^{\omega^\omega}}, \cdots\right\}" display-mode />
      对<vue-latex expression="\varepsilon_0" />继续映射<vue-latex expression="\alpha\mapsto \omega^\alpha" />，我们得到
      <vue-latex expression="\omega^{\varepsilon_0} = \sup\left\{1, \omega, \omega^\omega, \omega^{\omega^\omega}, \omega^{\omega^{\omega^\omega}}, \omega^{\omega^{\omega^{\omega^\omega}}}, \cdots\right\} = \varepsilon_0" display-mode />
      因此<vue-latex expression="\varepsilon_0" />是映射<vue-latex expression="\alpha\mapsto \omega^\alpha" />的第一个不动点
      <vue-latex expression="\varepsilon_0 = \mathrm{1st}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}" display-mode />
      其中，fp.是不动点(Fixed Point)的缩写<br>
      我们称<vue-latex expression="\varepsilon_0" />为SCO(Small Cantor Ordinal)，由于<vue-latex expression="\varepsilon_0" />已经是<vue-latex expression="\alpha\mapsto \omega^\alpha" />的不动点，继续进行该操作不会有任何作用。<br>
      不过，我们并非无法继续，只需要将<vue-latex expression="\varepsilon_0" />取后继，得到<vue-latex expression="\varepsilon_0+1" />，就跳出了映射<vue-latex expression="\alpha\mapsto \omega^\alpha" />的不动点。<br>
      继续对<vue-latex expression="\varepsilon_0+1" />进行映射<vue-latex expression="\alpha\mapsto \omega^\alpha" />，我们可以得到一个序数序列，它的极限是<vue-latex expression="\varepsilon_1" />
      <vue-latex expression="\varepsilon_1 = \sup\left\{0, 1, \varepsilon_0, \omega^{\varepsilon_0+1}, \omega^{\omega^{\varepsilon_0+1}}, \omega^{\omega^{\omega^{\varepsilon_0+1}}}, \cdots\right\}" display-mode />
    </div>
    <div v-else-if="player.help.epsilon && player.help.page == 6">
      类似于<vue-latex expression="\varepsilon_0" />，<vue-latex expression="\varepsilon_1 = \omega^{\varepsilon_1}" /><br>
      因此<vue-latex expression="\varepsilon_1" />是映射<vue-latex expression="\alpha\mapsto \omega^\alpha" />的第二个不动点，记作
      <vue-latex expression="\varepsilon_1 = \mathrm{2nd}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}" display-mode />
      或者我们也可以说，<vue-latex expression="\varepsilon_1" />是紧随于<vue-latex expression="\varepsilon_0" />之后，映射<vue-latex expression="\alpha\mapsto \omega^\alpha" />的第二个不动点，我们将其记为
      <vue-latex expression="\varepsilon_1 = \alpha\mapsto \omega^\alpha\textrm{ fp. aft } \varepsilon_0" display-mode />
      这里，aft是在......之后(after)的意思<br>
      类似的，通过重复上述过程，我们得到
      <vue-latex expression="\begin{aligned}
        \varepsilon_2 &= \sup\left\{0, 1, \varepsilon_1, \omega^{\varepsilon_1+1}, \omega^{\omega^{\varepsilon_1+1}}, \omega^{\omega^{\omega^{\varepsilon_1+1}}}, \cdots\right\}\\
            &= \mathrm{3rd}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}\\
            &= \alpha\mapsto \omega^\alpha\textrm{ fp. aft } \varepsilon_1
        \end{aligned}" display-mode />
      <vue-latex expression="\begin{aligned}
        \varepsilon_3 &= \sup\left\{0, 1, \varepsilon_2, \omega^{\varepsilon_2+1}, \omega^{\omega^{\varepsilon_2+1}}, \omega^{\omega^{\omega^{\varepsilon_2+1}}}, \cdots\right\}\\
            &= \mathrm{4th}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}\\
            &= \alpha\mapsto \omega^\alpha\textrm{ fp. aft } \varepsilon_2
        \end{aligned}" display-mode />
      在所有的<vue-latex expression="\varepsilon_n" />，对所有的这些序数取上确界，得到
      <vue-latex expression="\begin{aligned}
        \varepsilon_\omega &= \sup\left\{\varepsilon_0, \varepsilon_1, \varepsilon_2, \varepsilon_3, \cdots\right\}\\
            &= \omega\mathrm{th}\ \alpha\mapsto \omega^\alpha\ \mathrm{fp.}\\
        \end{aligned}" display-mode />
      重复上述取不动点和取下标极限的操作，我们可以得到所有的<vue-latex expression="\varepsilon" />序数。
    </div>
    <div v-else-if="player.help.epsilon && player.help.page == 7">
      下面我们递归地给出<vue-latex expression="\varepsilon" />序数的基本列<br>
        1. <vue-latex expression="\omega[n] = n" /><br>
        2. <vue-latex expression="(\alpha+\beta)[n] = \alpha+\beta[n]" />，其中<vue-latex expression="\beta" />是极限序数<br>
        3. <vue-latex expression="\omega^{\alpha+1}[n] = \omega^\alpha\cdot n" /><br>
        4. <vue-latex expression="\omega^\alpha[n] = \omega^{\alpha[n]}" />，其中<vue-latex expression="\alpha" />是极限序数<br>
        5. <vue-latex expression="\varepsilon_0[0] = 0, \varepsilon_0[n+1] = \omega^{\varepsilon_0[n]}" /><br>
        6. <vue-latex expression="\varepsilon_{\alpha+1}[0] = \varepsilon_\alpha+1, \varepsilon_{\alpha+1}[n+1] = \omega^{\varepsilon_{\alpha+1}[n]}" /><br>
        7. <vue-latex expression="\varepsilon_{\alpha}[n] = \varepsilon_{\alpha[n]}" />，其中<vue-latex expression="\alpha" />是极限序数<br>
        我们将对<vue-latex expression="\varepsilon_{\varepsilon_0}"></vue-latex>进行基本列展开，每一次展开四列。
        1. <vue-latex expression="\varepsilon_{\varepsilon_0}[4]"></vue-latex><br/>
        2. <vue-latex expression="\varepsilon_{\varepsilon_0[4]}"></vue-latex><br/>
        3. <vue-latex expression="\varepsilon_{\omega^{\varepsilon_0[3]}}"></vue-latex><br/>
        4. <vue-latex expression="\varepsilon_{\omega^{\omega^{\varepsilon_0[2]}}}"></vue-latex><br/>
        5. <vue-latex expression="\varepsilon_{\omega^{\omega^{\omega^{\varepsilon_0[1]}}}}"></vue-latex><br/>
        6. <vue-latex expression="\varepsilon_{\omega^{\omega^{\omega^{\omega^{\varepsilon_0[0]}}}}}"></vue-latex><br/>
        7. <vue-latex expression="\varepsilon_{\omega^{\omega^{\omega^{\omega^{0}}}}}"></vue-latex><br/>
        8. <vue-latex expression="\varepsilon_{\omega^{\omega^{\omega^{1}}}}"></vue-latex><br/>
        9. <vue-latex expression="\varepsilon_{\omega^{\omega^{\omega}}}"></vue-latex><br/>
        10. <vue-latex expression="\varepsilon_{\omega^{\omega^{4}}}"></vue-latex><br/>
        11. <vue-latex expression="\varepsilon_{\omega^{\omega^{3}4}}"></vue-latex><br/>
        12. <vue-latex expression="\varepsilon_{\omega^{\omega^{3}3+\omega^{2}3+\omega3+4}}"></vue-latex><br/>
    </div>
    <div v-else-if="player.help.epsilon && player.help.page == 8">
      下面我们考虑<vue-latex expression="\alpha\mapsto\varepsilon_\alpha"></vue-latex>的映射。<br />
      从0开始重复作用上述映射，所得到的极限就是<vue-latex expression="\zeta_0"></vue-latex>，它的基本列是<br />
      <vue-latex expression="\zeta_0 = \sup\left\{0, \varepsilon_0, \varepsilon_{\varepsilon_0}, \varepsilon_{\varepsilon_{\varepsilon_0}}, \cdots\right\}" display-mode />
      不难发现，<vue-latex expression="\zeta_0 = \varepsilon_{\zeta_0}"></vue-latex>，所以我们也可以像ε序数操做它：
      <vue-latex expression="\varepsilon_{\zeta_0+1} = \sup\left\{0, 1, \zeta_0, \omega^{\zeta_0+1}, \omega^{\omega^{\zeta_0+1}}, \omega^{\omega^{\omega^{\zeta_0+1}}},\cdots\right\}" display-mode></vue-latex>
      那么问题来了，<vue-latex expression="\zeta_1"></vue-latex>是什么？<br />
      <vue-latex expression="\begin{aligned}
      \zeta_1 &= \alpha\mapsto \varepsilon_\alpha\textrm{ fp. aft } \zeta_0\\
      &=\sup\left\{\zeta_0+1,\varepsilon_{\zeta_0+1},\varepsilon_{\varepsilon_{\zeta_0+1}},\cdots\right\}
      \end{aligned}
      " display-mode></vue-latex>
      <vue-latex expression="\begin{aligned}
      \zeta_2 &= \alpha\mapsto \varepsilon_\alpha\textrm{ fp. aft } \zeta_1\\
      &=\sup\left\{\zeta_1+1,\varepsilon_{\zeta_1+1},\varepsilon_{\varepsilon_{\zeta_1+1}},\cdots\right\}
      \end{aligned}
      " display-mode></vue-latex>
      可以整理出以下基本列展开方法：<br />
      1.<vue-latex expression="\zeta_0[0] = 0" /><br/>
      2.<vue-latex expression="\zeta_0[n+1] = \varepsilon_{\zeta_0[n]}" /><br/>
      3.<vue-latex expression="\alpha"></vue-latex>为极限序数，<vue-latex expression="\zeta_\alpha[n] = \zeta_{\alpha[n]}" /><br/>
      4.<vue-latex expression="\zeta_{\alpha+1} = \beta\mapsto\varepsilon_\beta\textrm{ fp. aft } \zeta_{\alpha}"></vue-latex><br/>
    </div>
    <div v-else-if="player.help.epsilon && player.help.page == 9">
      下面我们考虑<vue-latex expression="\alpha\mapsto\zeta_\alpha"></vue-latex>的映射。<br />
      从0开始重复作用上述映射，所得到的极限就是<vue-latex expression="\eta_0"></vue-latex>，基本列<br />
      <vue-latex expression="\eta_0 = \sup\left\{0, \zeta_0, \zeta_{\zeta_0}, \zeta_{\zeta_{\zeta_0}}, \cdots\right\}" display-mode />
      <vue-latex expression="\eta_0 = \varepsilon_{\eta_0} = \zeta_{\eta_0} "></vue-latex>，
      基本列展开方法和<vue-latex expression="\zeta_\alpha"></vue-latex>相似，<br />
      1.<vue-latex expression="\eta_0[0] = 0" /><br/>
      2.<vue-latex expression="\eta_0[n+1] = \zeta_{\eta_0[n]}" /><br/>
      3.<vue-latex expression="\alpha"></vue-latex>为极限序数，<vue-latex expression="\eta_\alpha[n] = \eta_{\alpha[n]}" /><br/>
      4.<vue-latex expression="\eta_{\alpha+1} = \beta\mapsto\zeta_\beta\textrm{ fp. aft } \eta_{\alpha}"></vue-latex><br/>
      到这里我们能发现这些规则和<vue-latex expression="\varepsilon_\alpha, \zeta_\alpha, \eta_\alpha"></vue-latex><br/>
      很相似。在各种各样的序数映射之下，不动点的结构可以变得非常复杂。<br />假如我们利用数阵型记号对不动点的层次结构进行标记，那么我们将得到Veblen函数。<br />
      最简单的Veblen 函数是只包含一个序数变量<vue-latex expression="\alpha" />的一元Veblen函数<vue-latex expression="\varphi(\alpha)" />，<br />
      它实际上就等于<vue-latex expression="\omega^\alpha" /><br />
      接下来有二元Veblen函数<vue-latex expression="\varphi(\alpha,\beta)"></vue-latex>。<br/>
      1. <vue-latex expression="\varphi(0,\alpha)=\varphi(\alpha)"></vue-latex><br />
      2. <vue-latex expression="\varphi(\alpha+1,0)=\beta\mapsto\varphi(\alpha,\beta)\textrm{ fp.}"></vue-latex><br />
      3. <vue-latex expression="\varphi(\alpha+1,\beta+1)=\gamma\mapsto\varphi(\alpha,\gamma)\textrm{ fp. }\varphi(\alpha+1,\beta)"></vue-latex><br />
      4. 对于任意极限序数<vue-latex expression="\alpha, \varphi(\alpha,\beta+1)=\sup\{\varphi(\gamma,\varphi(\alpha,\beta)+1)|\gamma<\alpha\}"></vue-latex><br />
      5. 对于任意极限序数<vue-latex expression="\gamma"></vue-latex>, 有<vue-latex expression="\varphi(\gamma, 0) = \sup\{\varphi(\beta, 0)|\beta<\gamma\}"></vue-latex>。<br />
      例如<vue-latex expression="\varphi(1,0) = \beta\mapsto\omega^{\beta} \textrm{ fp.} = \varepsilon_0"></vue-latex>,<br />
      <vue-latex expression="\varphi(1,1) = \gamma\mapsto\omega^\gamma\textrm{ fp. }\varphi(1,0) = \varepsilon_1"></vue-latex>,<br/>
      我们可以推导出<vue-latex expression="\varphi(1,\alpha) = \varepsilon_\alpha"></vue-latex>，同样的，<vue-latex expression="\varphi(2,\alpha) = \zeta_\alpha"></vue-latex>，<vue-latex expression="\varphi(3,\alpha) = \eta_\alpha"></vue-latex>。<br/>
      

    </div>
    <div v-else-if="player.help.epsilon && player.help.page == 10">
      接下来定义一个序数,<vue-latex expression="\Gamma_0 = \alpha\mapsto\varphi(\alpha,0)\textrm{ fp.} = \varphi(1,0,0)"></vue-latex>
      这里的<vue-latex expression="\varphi"></vue-latex>函数是一个多元函数。<br />
      有以下规则:<br />
      1. n为非0有限序数<vue-latex expression="\varphi(\#,n+1,\alpha+1)=\beta\mapsto\varphi(\#,n,\beta) \mathrm{ fp. aft }\varphi(\#,n+1,\alpha)"></vue-latex><br />
      2. <vue-latex expression="\varphi(\#,\alpha+1,0,\mathrm{O}, 0)=\beta\mapsto\varphi(\#,\alpha, \beta,\mathrm{O},0)\mathrm { fp. }"></vue-latex><br />
      3. <vue-latex expression="\varphi(\#,\alpha+1,0,\mathrm{O}, \gamma+1)=\beta\mapsto\varphi(\#,\alpha, \beta,\mathrm{O},0)\mathrm { fp. aft}\varphi(\#, \alpha+1, 0, \mathrm{O}, \gamma)"></vue-latex><br />
      4. <vue-latex expression="\varphi(\#,\beta, \#,\alpha+1) = \sup{\varphi(\#,\gamma,\#,\varphi(\#,\beta,\#,\alpha)+1)|\gamma<\beta}"></vue-latex>
      (此处规则不全， 待补充)
      <br />
      在<vue-latex expression="\Gamma_0"></vue-latex>后，还有Ackermann 序数 <vue-latex expression="\varphi(1,0,0,0)"></vue-latex>。<br />
      我们可以把<vue-latex expression="\varphi"></vue-latex>函数扩展到任意有限元。
    </div>
	<div v-else-if="player.help.page == 101">
		序数折叠函数(OCF)，用另一种方式来枚举不动点。<br />
		其定义涉及集合论，但行为逻辑可以用非常简单的形式归纳。<br />
		它的基本形式是<vue-latex expression="\psi(0)=\omega" />，其中的参数每增加1都会让序数乘以<vue-latex expression="\omega" /><br />
		根据上一条定义，能表达的最大序数是<vue-latex expression="\varepsilon_0" />。<br />
		随后OCF引入了<vue-latex expression="\Omega" />，它是第一个非递归序数。在OCF的参数末尾的<vue-latex expression="\Omega" />带来一个<vue-latex expression="\Omega" />前运算的不动点。<br />
		<vue-latex expression="\psi(0)=\omega" /><br />
		<vue-latex expression="\psi(X+1)=\psi(X)\cdot\omega" /><br />
		<vue-latex expression="\psi(X*\Omega)=\alpha\mapsto\psi(X*\alpha)FP" />(其中*为加法、乘法、乘方之一)<br />
		<vue-latex expression="\psi(\sup\ \alpha[n \in N^+])[n]=\psi(\alpha[n])" /><br />
		以上四条规则构成了一个基本的OCF，它的极限<vue-latex expression="\psi(\varepsilon_{\Omega+1})" />相当于Veblen函数的极限——BHO。<br />
		稍微修改一下规则，可以炮制出一批这样的OCF。<br />
		例如，对于第二个非递归序数<vue-latex expression="\Omega_2" />，只需要将<vue-latex expression="\psi(0)" />改成<vue-latex expression="\Omega" />，然后将第三条的<vue-latex expression="\Omega" />改成<vue-latex expression="\Omega_2" />。<br />
		为了区分，这种OCF表示为<vue-latex expression="\psi_{\Omega_2}(X)" />，它输出<vue-latex expression="\Omega" />的各种不动点。<br />
		随后，将这个新的OCF的输出结果套入原来的OCF中，极限就被扩展了。<br />
		为了简化，如果存在<vue-latex expression="\Omega_{X}" />，则<vue-latex expression="\psi(X*\Omega_{X})=\psi(\psi_{\Omega_X}(X*\Omega_X))" /><br />
		除了<vue-latex expression="\psi_{\Omega_2}(X)" />，还有<vue-latex expression="\psi_{\Omega_3}(X)" />，<vue-latex expression="\psi_{\Omega_4}(X)" />......<br />
		<vue-latex expression="\Omega_\omega=\sup \Omega_{\omega[n]}" /><br />
		将其放入OCF中得到的序数是很多记号的极限，也是FGH和SGH的第一个追平点，称为BO。自BO以后，序数分析步入了反射序数时代。<br />
	</div>
	<div v-else-if="player.help.page == 102">
		经过简单的扩展，OCF可以在BO以上继续提升，但这样的提升收效甚微，此处暂且不表。<br />
		任意递归序数层级的OCF的极限是<vue-latex expression="\psi(\Omega_\Omega)=\alpha\mapsto\psi(\Omega_\alpha)FP" />，它是扩展鸟之记号的极限，被称为BIO。<br />
		显然可以通过一个更高层的序数来折叠这一过程，因此OCF引入了递归不可达序数，第一个这种序数是<vue-latex expression="I" />。<br />
		关于它的OCF的定义与<vue-latex expression="\Omega_X" />类似，但<vue-latex expression="\psi_I(X)=\Omega_X" />，因此<vue-latex expression="\psi(I)=\psi(\alpha\mapsto\Omega_\alphaFP)" />。<br />
		<vue-latex expression="\psi(I)" />被称为扩展BO，也就是EBO，它是单独使用<vue-latex expression="\Omega" />的OCF的最终极限。<br />
		在<vue-latex expression="I" />之上，还可以定义关于更高的递归不可达序数<vue-latex expression="I_X" />的OCF，它的对应规则是<vue-latex expression="\psi_{I_{X+1}}(Y)=\Omega_{I_X+Y}" />。<br />
		折叠这些OCF的序数是<vue-latex expression="I(1,0)" />，<vue-latex expression="\psi_{I(1,0)}(X)=I_X" /><br />
		如此，使用Veblen函数的表示法，可以表达最高<vue-latex expression="\psi_{I(1@(1@(...)))}" />的序数，它相当于BMS的<vue-latex expression="(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(5,2,0)" />，被称为SRO。<br />
		我们可以用一个更高层次的OCF来折叠<vue-latex expression="I(a,b,c...)" />，它就是<vue-latex expression="M" />。<br />
		<vue-latex expression="\psi_M(X)=\Omega_X" /><br />
		<vue-latex expression="\psi_M(X*M)=\alpha\mapsto\psi(X*\alpha)AP" />(其中*为加法、乘法、乘方之一)<br />
		<vue-latex expression="\psi_M(\sup\ \alpha[n \in N^+])[n]=\psi_M(\alpha[n])" /><br />
		其中AP表示容许点，也就是用对应运算重复任意递归序数次数也无法达到的序数。<br />
		含有<vue-latex expression="M" />的OCF可以像普通OCF折叠Veblen一样折叠<vue-latex expression="I" />的Veblen。<br />
	</div>
    <div v-else-if="player.help.page >= 4321">
      已达到当前版本残局：4321页。
      <!--<br>{{highestPage}}-!-->
    </div>
    <div v-else-if="player.help.page >= 3200">
      你的向后翻页按钮又一次被加强了!
    </div>
    <div v-else-if="player.help.page >= 2125">
      你的页面数达到了一个不可思议的水平！作为奖励，向后翻页按钮变得更强......
    </div>
    <div v-else-if="player.help.page >= 1000">
      你翻了太多页面了......向后翻页按钮变得不稳定......
    </div>
  </div>
</template>