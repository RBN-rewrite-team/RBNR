// utils/modal.ts
import { createApp, h, ref, type Component, type App } from 'vue'
import Modal from '../components/Modal.vue'

export interface FieldConfig {
  type?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
  validation?: RegExp | ((value: string) => boolean)
  validateOnChange?: boolean
  errorMessage?: string
  rows?: number
}

export interface ButtonConfig {
  text: string
  handler: (e?: MouseEvent, instance?: ModalInstance) => void
  class?: string
  disabled?: boolean
}

export interface ModalOptions {
  title?: string
  content?: string
  icon?: Component
  fields?: FieldConfig[]
  width?: string
  confirmText?: string
  cancelText?: string
  closeOnClickMask?: boolean
  validateOnChange?: boolean
  showProgress?: boolean
  progress?: number
  buttons?: ButtonConfig[]
  onConfirm?: (values: string[]) => void
  onCancel?: () => void
  showCancelButton?: boolean
  showConfirmButton?: boolean
}

export interface ModalInstance {
  handleConfirm?: () => void
  handleCancel?: () => void
  close?: () => void
}

export interface ProgressController {
  updateProgress: (value: number) => void
  updateContent: (content: string) => void
  updateButtons: (buttons: ButtonConfig[]) => void
  close: () => void
  getInstance: () => ModalInstance | null
}

const ModalService = {
  show(options: ModalOptions): { controller: ProgressController } {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const visible = ref(true)
    const progress = ref(options.progress || 0)
    const customButtons = ref(options.buttons || [])
    const currentContent = ref(options.content || '')
    let modalInstance: ModalInstance | null = null

    const controller: ProgressController = {
      updateProgress: (value: number) => {
        progress.value = Math.min(100, Math.max(0, value))
      },
      updateButtons: (buttons: ButtonConfig[]) => {
        customButtons.value = buttons.map((btn) => ({
          ...btn,
          handler: () => btn.handler(undefined, modalInstance!),
        }))
      },
      updateContent: (content: string) => {
        currentContent.value = content
      },
      close: () => {
        visible.value = false
        setTimeout(() => {
          app.unmount()
          container.remove()
        }, 300)
      },
      getInstance: () => modalInstance,
    }

    const app: App = createApp({
      setup(_, { expose }) {
        const methodsRef = ref<ModalInstance>()

        // 创建代理方法
        const exposedMethods = {
          handleConfirm: () => methodsRef.value?.handleConfirm?.(),
          handleCancel: () => methodsRef.value?.handleCancel?.(),
          close: () => methodsRef.value?.close?.(),
        }

        expose({ getMethods: () => exposedMethods })

        return () =>
          h(Modal, {
            ref: (el: any) => {
              if (el) {
                methodsRef.value = {
                  handleConfirm: el.handleConfirm,
                  handleCancel: el.handleCancel,
                }
                modalInstance = methodsRef.value // 更新实例引用
              }
            },
            visible: visible.value,
            title: options.title,
            content: currentContent.value,
            icon: options.icon,
            fields: options.fields,
            modalWidth: options.width,
            showCancelButton: options.showCancelButton,
            showConfirmButton: options.showConfirmButton,
            closeOnClickMask: options.closeOnClickMask,
            validateOnChange: options.validateOnChange,
            showProgress: options.showProgress,
            progress: progress.value,
            customButtons: customButtons.value.map((btn) => ({
              ...btn,
              handler: () => btn.handler(undefined, modalInstance!), // 直接使用实例引用
            })),
            'onUpdate:visible': (val: boolean) => {
              if (!val) controller.close()
            },
            onConfirm: (values: string[]) => {
              options.onConfirm?.(values)
              controller.close()
            },
            onCancel: () => {
              options.onCancel?.()
              controller.close()
            },
          })
      },
    })

    app.mount(container)
    return { controller }
  },
}

export default ModalService
