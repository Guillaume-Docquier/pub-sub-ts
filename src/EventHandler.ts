import { type Event } from './Event.ts'

export type EventHandler<TEvent extends Event> = (event: TEvent) => void
