import { type Event } from './Event.ts'
import { type EventHandler } from './EventHandler.ts'

export interface PubSub<TEvent extends Event> {
  publish: (event: TEvent) => void
  subscribe: <TEventName extends TEvent['name']>(eventName: TEventName, handler: EventHandler<TEvent & {
    name: TEventName
  }>) => void
  unsubscribe: (handler: EventHandler<TEvent>) => void
}

export const PubSub = {
  create<TEvent extends Event>(): PubSub<TEvent> {
    const eventHandlers = new Map<TEvent['name'], Set<EventHandler<TEvent>>>()
    const eventHandlersReverseLookup = new Map<EventHandler<TEvent>, TEvent['name']>()

    function publish (event: TEvent): void {
      const handlers = eventHandlers.get(event.name) ?? []
      for (const handler of handlers) {
        handler(event)
      }
    }

    function subscribe<TEventName extends TEvent['name']> (eventName: TEventName, handler: EventHandler<TEvent & {
      name: TEventName
    }>): void {
      if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, new Set())
      }

      // At this point, there should always be an entry for that event name
      eventHandlers.get(eventName)?.add(handler as EventHandler<TEvent>)
      eventHandlersReverseLookup.set(handler as EventHandler<TEvent>, eventName) // TODO GD Can I avoid the cast?
    }

    function unsubscribe (handler: EventHandler<TEvent>): void {
      const eventName = eventHandlersReverseLookup.get(handler)
      if (eventName === undefined) {
        return
      }

      // At this point, there should always be an entry for that event name
      eventHandlers.get(eventName)?.delete(handler)
      eventHandlersReverseLookup.delete(handler)
    }

    return {
      publish,
      subscribe,
      unsubscribe,
    }
  },
}
