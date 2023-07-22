import { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'
import { HTMLAttributes, DetailedHTMLProps } from 'react'

export interface IAddLottieAnimation extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  animationConfig:
    | Omit<AnimationConfigWithPath<'svg'>, 'container' | 'renderer'>
    | Omit<AnimationConfigWithData<'svg'>, 'container' | 'renderer'>
}
