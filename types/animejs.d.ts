declare module 'animejs' {
  export interface AnimeInstance {
    revert?: () => void
    pause?: () => void
    play?: () => void
    cancel?: () => void
  }

  export interface AnimeParams {
    duration?: number
    delay?: unknown
    ease?: string
    loop?: boolean | number
    alternate?: boolean
    onUpdate?: () => void
    onComplete?: () => void
    [property: string]: unknown
  }

  export function animate(targets: unknown, params: AnimeParams): AnimeInstance

  export const utils: {
    stagger: (value: number, options?: Record<string, unknown>) => unknown
    [key: string]: unknown
  }
}
