import { type Event } from './Event.ts'
import { type EventHandler } from './EventHandler.ts'

/**
 * A publisher/subscriber system.
 * You can specify the events of your system via a type union.
 * e.g:
 * ```
 * type MyEvents = MyEvent1 | MyEvent2
 * const pubSub = PubSub.create<MyEvents>()
 * ```
 */
export interface PubSub<TEvents extends Event> {
  /**
   * Publishes an event and notifies all subscribers of this event.
   *
   * @param event - The event to send to all subscribers.
   */
  publish: (event: TEvents) => void

  /**
   * Subscribes an event handler for a certain event.
   * The event handler is stored by reference so that you can unsubscribe it later on.
   * Because the handler is stored by reference, you cannot use the same handler for different events.
   * This function will throw if you attempt to register the same handler for different events.
   *
   * @param eventName - The name of the event to subscribe to.
   * @param handler - The handle to call when the event occurs.
   */
  subscribe: <TEventName extends TEvents['name']>(eventName: TEventName, handler: EventHandler<TEvents & {
    name: TEventName
  }>) => void

  /**
   * Unsubscribes the event handler.
   * You need to provide the same handler that was subscribed, because they are stored by reference.
   *
   * @param handler - The handler to unsubscribe.
   */
  unsubscribe: (handler: EventHandler<TEvents>) => void
}

/**
 * A factory to create PubSubs
 */
export const PubSub = {
  /**
   * Creates a PubSub.
   * You can specify the events of your system via a type union.
   * e.g:
   * ```
   * type MyEvents = MyEvent1 | MyEvent2
   * const pubSub = PubSub.create<MyEvents>()
   * ```
   */
  create<TEvents extends Event>(): PubSub<TEvents> {
    const eventHandlers = new Map<TEvents['name'], Set<EventHandler<TEvents>>>()
    const eventHandlersReverseLookup = new Map<EventHandler<TEvents>, TEvents['name']>()

    function publish (event: TEvents): void {
      const handlers = eventHandlers.get(event.name) ?? []
      for (const handler of handlers) {
        handler(event)
      }
    }

    function subscribe<TEventName extends TEvents['name']> (eventName: TEventName, handler: EventHandler<TEvents & {
      name: TEventName
    }>): void {
      if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, new Set())
      }

      // At this point, there should always be an entry for that event name
      eventHandlers.get(eventName)?.add(handler as EventHandler<TEvents>)
      eventHandlersReverseLookup.set(handler as EventHandler<TEvents>, eventName) // TODO GD Can I avoid the cast?
    }

    function unsubscribe (handler: EventHandler<TEvents>): void {
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
