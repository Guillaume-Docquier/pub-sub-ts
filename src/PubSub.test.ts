import { describe, expect, it, vitest } from 'vitest'
import { PubSub } from './PubSub.ts'
import { type Event } from './Event.ts'

type MyEvents = MyEvent1 | MyEvent2

interface MyEvent1 extends Event {
  name: 'MyEvent1'
  payload: {
    prop1: string
  }
}

interface MyEvent2 extends Event {
  name: 'MyEvent2'
  payload: {
    prop2: number
  }
}

describe('PubSub', () => {
  describe('subscribe', () => {
    it.each([1, 2, 3])('should register the handler only once even if called %o times', nbSubscribe => {
      // Arrange
      const pubSub = PubSub.create<MyEvents>()
      const event: MyEvent1 = {
        name: 'MyEvent1',
        payload: {
          prop1: 'prop1',
        },
      }

      const handlerSpy = vitest.fn()

      // Act
      for (let i = 0; i < nbSubscribe; i++) {
        pubSub.subscribe(event.name, handlerSpy)
      }

      // Assert
      pubSub.publish(event)

      expect(handlerSpy).toHaveBeenCalledOnce()
      expect(handlerSpy).toHaveBeenCalledWith(event)
    })
  })

  describe('unsubscribe', () => {
    it('should un-register the handler when found', () => {
      // Arrange
      const pubSub = PubSub.create<MyEvents>()
      const event: MyEvent1 = {
        name: 'MyEvent1',
        payload: {
          prop1: 'prop1',
        },
      }

      const handlerSpy = vitest.fn()
      pubSub.subscribe(event.name, handlerSpy)

      // Act
      pubSub.unsubscribe(handlerSpy)

      // Assert
      pubSub.publish(event)

      expect(handlerSpy).not.toHaveBeenCalled()
    })

    it('should do nothing when the handler is not found', () => {
      // Arrange
      const pubSub = PubSub.create<MyEvents>()

      const handlerSpy = vitest.fn()

      // Act & Assert
      expect(() => {
        pubSub.unsubscribe(handlerSpy)
      }).not.toThrow()
    })
  })

  describe('publish', () => {
    it('should notify all subscribers of the event', () => {
      // Arrange
      const pubSub = PubSub.create<MyEvents>()
      const event: MyEvent1 = {
        name: 'MyEvent1',
        payload: {
          prop1: 'prop1',
        },
      }

      const handlerSpy1 = vitest.fn()
      pubSub.subscribe(event.name, handlerSpy1)

      const handlerSpy2 = vitest.fn()
      pubSub.subscribe(event.name, handlerSpy2)

      const handlerSpy3 = vitest.fn()
      pubSub.subscribe(event.name, handlerSpy3)

      // Act
      pubSub.publish(event)

      // Assert
      expect(handlerSpy1).toHaveBeenCalledOnce()
      expect(handlerSpy1).toHaveBeenCalledWith(event)

      expect(handlerSpy2).toHaveBeenCalledOnce()
      expect(handlerSpy2).toHaveBeenCalledWith(event)

      expect(handlerSpy3).toHaveBeenCalledOnce()
      expect(handlerSpy3).toHaveBeenCalledWith(event)
    })

    it('should do nothing when there are no subscribers', () => {
      // Arrange
      const pubSub = PubSub.create<MyEvents>()
      const event: MyEvent1 = {
        name: 'MyEvent1',
        payload: {
          prop1: 'prop1',
        },
      }

      const handlerSpy2 = vitest.fn()
      pubSub.subscribe('MyEvent2', handlerSpy2)

      const handlerSpy3 = vitest.fn()
      pubSub.subscribe('MyEvent2', handlerSpy3)

      // Act
      pubSub.publish(event)

      // Assert
      expect(handlerSpy2).not.toHaveBeenCalled()
      expect(handlerSpy3).not.toHaveBeenCalled()
    })
  })
})
