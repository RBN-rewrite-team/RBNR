<template>
  <div>
    序数是数学中用来表示“顺序”的数，它扩展了我们熟悉的自然数(0, 1, 2, 3 ...)，可以表示无限序列中的位置。<br>
    序数具有以下规则：<br>
      1. 一个数的下一个数仍然是一个序数<br>
      2. 对于任意由序数构成的集合，存在一个最小的序数，它大于这集合中所有的序数。<br><br>
    上述两条规则给出了两种不同的序数，我们分别称之为后继序数和极限序数，它们的具体定义如下：<br>
      1. 对任意序数<vue-latex expression="α" />，存在一个序数<vue-latex expression="α'=α+1" />，我们称之为后继序数。<br>
      2. 对于任意由序数构成的序数数列<vue-latex expression="\{α_n\}" />，存在一个序数<vue-latex expression="β" />满足<vue-latex expression="β = \sup_n\{α_n\}" /><br>
        这里，<vue-latex expression="\sup" />为上确界，它指的就是大于（或等于）集合中所有元素的最小元素。<br>
        我们称<vue-latex expression="β" />为极限序数，<vue-latex expression="\{α_n\} = \{a_0, a_1, a_2, \cdots\}" />称为<vue-latex expression="β" />的基本列，记作<vue-latex expression="β[n] = a_n" /><br><br>
        需要注意的是，基本列的指标默认是从 0 开始的，也就是说一个极限序数<vue-latex expression="β" />应当表示为
        <vue-latex expression="β = \sup_n\{β[n]\} = \sup\{β[0], β[1], β[2], \cdots\}" display-mode />
    现在我们就得到了构造序数的两种方法：对序数取后继，以及选取出一个序数数列并对其取极限。<br>
    0 是最小的序数，除了 0 之外，所有的序数都是以上两种情况之一。<br>
    从 0 开始，不断取后继，我们就可以得到一个自然数数列
    <vue-latex expression="\{0,1,2,3,\cdots\}" display-mode />
    这也是一个序数数列，由这一数列的上确界可以定义一个新的序数
    <vue-latex expression="\omega = \sup\{0,1,2,3,\cdots\}" display-mode />
    与自然数类似，序数之间也可以进行运算。对自然数之间的运算规则进行推广，我们便可以得到序数之间的运算规则<br>
      序数的加法定义为：<br>
        1. 对任意序数<vue-latex expression="α" />，<vue-latex expression="α+0 = α" /><br>
        2. 对任意序数<vue-latex expression="α, β" />，<vue-latex expression="α+β' = (α+β)'" /><br>
        3. 对任意序数<vue-latex expression="α" />和极限序数<vue-latex expression="β" />，<vue-latex expression="α+β = \sup\{α+γ|γ<β\}" /><br>
      特别地，如果我们考虑的极限序数的基本列为<vue-latex expression="β[n]" />，那么上述第三条规则可以进一步表示为
      <vue-latex expression="a+β=\sup_n\{α+β[n]\}" display-mode />
      注意，序数的加法并不满足交换律，但可以验证，序数的加法仍然满足结合律。<br>
      类似的，序数的乘法定义为：<br>
        1. 对任意序数<vue-latex expression="α" />，<vue-latex expression="α\cdot0 = 0" /><br>
        2. 对任意序数<vue-latex expression="α, β" />，<vue-latex expression="α\cdotβ' = α\cdotβ+α" /><br>
        3. 对任意序数<vue-latex expression="α" />和极限序数<vue-latex expression="β" />，<vue-latex expression="α\cdotβ = \sup\{α\cdotγ|γ<β\}" /><br>
      特别地，如果我们考虑的极限序数的基本列为<vue-latex expression="β[n]" />，那么上述第三条规则可以进一步表示为
      <vue-latex expression="a\cdotβ=\sup_n\{α\cdotβ[n]\}" display-mode />
      由上述定义可知，序数的加法满足结合律和左分配律
      <vue-latex expression="(α\cdotβ)\cdotγ = α\cdot(β\cdotγ)," display-mode />
      <vue-latex expression="α\cdot(β+γ) = α\cdotβ+α\cdotγ" display-mode />
      右分配律是不满足的，例如：
      <vue-latex expression="(\omega+1)\cdot2 = (\omega+1)+(\omega+1) = \omega+(1+\omega)+1 = \omega+\omega+1 = \omega\cdot2+1" display-mode />
      可以验证，序数的乘法同样不满足交换律<br>
      类似的，序数的指数定义为：<br>
        1. 对任意序数<vue-latex expression="α" />，<vue-latex expression="α^0 = 1" /><br>
        2. 对任意序数<vue-latex expression="α, β" />，<vue-latex expression="α^{β'} = α^β\cdotα" /><br>
        3. 对任意序数<vue-latex expression="α" />和极限序数<vue-latex expression="β" />，<vue-latex expression="α^β = \sup\{α^γ|γ<β\}" /><br>
      特别地，如果我们考虑的极限序数的基本列为<vue-latex expression="β[n]" />，那么上述第三条规则可以进一步表示为
      <vue-latex expression="a^β=\sup_n\{α^{β[n]}\}" display-mode />
      可以验证，序数指数满足如下的运算规则：
      <vue-latex expression="α^{β+γ} = α^β\cdotα^γ," display-mode />
      <vue-latex expression="(α^β)^γ = α^{β\cdotγ}" display-mode />
      相比于自然数运算来说，序数运算的一个重要特征是不动点的存在。<br>
      我们称某个序数<vue-latex expression="β" />是<vue-latex expression="α\mapsto f(α)" />的不动点，指的是若将<vue-latex expression="β" />变换为<vue-latex expression="f(β)" />，有<vue-latex expression="β = f(β)" />
  </div>
</template>