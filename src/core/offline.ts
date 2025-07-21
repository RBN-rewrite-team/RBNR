import Async from '@/utils/asyncs'
import { startGameLoop, stopGameLoop } from '../main'
import { simulate } from './game-loop'
import { save } from '@/core/save/'
import Modal from '@/utils/Modal'
import { formatTime } from '@/utils/format'
export function simulateTime(miliseconds: number): void {
  if (miliseconds < 0) throw new Error('?')
  let ticks = Math.floor(miliseconds / 40)
  ticks = Math.min(ticks, 100000)
  let remaining = miliseconds
  const startTime = Date.now()
  const loopFn = () => {
    const diff = miliseconds / ticks
    simulate(diff)
    remaining -= diff
  }
  const progress = {}
  let modal: ReturnType<typeof Modal.show>;
  Async.run(loopFn, ticks, {
    batchSize: 1,
    maxTime: 30,
    sleepTime: 1,
    asyncEntry: (doneSoFar: number) => {
      stopGameLoop()
      modal = Modal.show({
        showProgress: true,
        title: '离线进度计算中',
        content: `已完成0/${ticks}帧的计算`,
      })
    },
    asyncProgress: (doneSoFar: number) => {
      modal.controller.updateContent(
        `已完成${doneSoFar}/${ticks}帧的计算<br>剩余时间：${formatTime(((Date.now() - startTime) / 1000 / doneSoFar) * (ticks - doneSoFar))}`,
      )
      modal.controller.updateProgress((doneSoFar / ticks) * 100)
    },
    asyncExit: () => {
      startGameLoop()
      modal.controller.close()
    },
    then: save,
    progress,
  })
}
