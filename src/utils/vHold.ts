import type { Directive, DirectiveBinding } from 'vue';

interface HoldHandlers {
  onStart?: (event: Event) => void;
  onHold?: (event: Event) => void;
  onProgress: (event: Event) => void;
  onRelease?: (event: Event) => void;
}

interface HoldDirectiveValue {
  handler: HoldHandlers;
  delay?: number;
  interval?: number;
}

declare global {
  interface HTMLElement {
    _holdStart?: (event: Event) => void;
    _holdEnd?: (event: Event) => void;
  }
}

export const vHold: Directive<HTMLElement, HoldDirectiveValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<HoldDirectiveValue>) {
    const { 
      handler, 
      delay = 500, 
      interval = 40 
    } = binding.value;
    
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let progressTimer: ReturnType<typeof setInterval> | null = null;

    const start = (e: Event) => {      
      if (handler.onStart) handler.onStart(e);
      
      pressTimer = setTimeout(() => {
        handler.onHold?.(e);
        
        if (handler.onProgress) {
          progressTimer = setInterval(() => handler.onProgress!(e), interval);
        }
      }, delay);
    };

    const stop = (e: Event) => {
      if (pressTimer) clearTimeout(pressTimer);
      if (progressTimer) clearInterval(progressTimer);
      
      pressTimer = null;
      progressTimer = null;
      
      if (handler.onRelease) handler.onRelease(e);
    };

    el._holdStart = start;
    el._holdEnd = stop;
    
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start);
    el.addEventListener('mouseup', stop);
    el.addEventListener('mouseleave', stop);
    el.addEventListener('touchend', stop);
    el.addEventListener('touchcancel', stop);
  },
  
  unmounted(el: HTMLElement) {
    if (el._holdStart) {
      el.removeEventListener('mousedown', el._holdStart);
      el.removeEventListener('touchstart', el._holdStart);
    }
    
    if (el._holdEnd) {
      el.removeEventListener('mouseup', el._holdEnd);
      el.removeEventListener('mouseleave', el._holdEnd);
      el.removeEventListener('touchend', el._holdEnd);
      el.removeEventListener('touchcancel', el._holdEnd);
    }
    
    delete el._holdStart;
    delete el._holdEnd;
  }
};
