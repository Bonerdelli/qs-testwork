import { antdTreeUseExpandedState, execOnAntdEvent } from '../antd'

describe('antd helpers', () => {
  describe('antdTreeUseExpandedState', () => {
    it('should add key when node is expanded', () => {
      const expandedKeys: number[] = [1, 2]
      const setExpandedKeys = jest.fn()
      const handler = antdTreeUseExpandedState(expandedKeys, setExpandedKeys)

      handler([1, 2, 3], {
        expanded: true,
        node: { key: 3 },
      })

      expect(setExpandedKeys).toHaveBeenCalledWith([1, 2, 3])
    })

    it('should remove key when node is collapsed', () => {
      const expandedKeys: number[] = [1, 2, 3]
      const setExpandedKeys = jest.fn()
      const handler = antdTreeUseExpandedState(expandedKeys, setExpandedKeys)

      handler([1, 2], {
        expanded: false,
        node: { key: 3 },
      })

      expect(setExpandedKeys).toHaveBeenCalledWith([1, 2])
    })

    it('should not modify keys when node is already expanded', () => {
      const expandedKeys: number[] = [1, 2, 3]
      const setExpandedKeys = jest.fn()
      const handler = antdTreeUseExpandedState(expandedKeys, setExpandedKeys)

      handler([1, 2, 3], {
        expanded: true,
        node: { key: 3 },
      })

      expect(setExpandedKeys).not.toHaveBeenCalled()
    })

    it('should not modify keys when node is already collapsed', () => {
      const expandedKeys: number[] = [1, 2]
      const setExpandedKeys = jest.fn()
      const handler = antdTreeUseExpandedState(expandedKeys, setExpandedKeys)

      handler([1, 2], {
        expanded: false,
        node: { key: 3 },
      })

      expect(setExpandedKeys).not.toHaveBeenCalled()
    })

    it('should handle empty expanded keys', () => {
      const expandedKeys: number[] = []
      const setExpandedKeys = jest.fn()
      const handler = antdTreeUseExpandedState(expandedKeys, setExpandedKeys)

      handler([1], {
        expanded: true,
        node: { key: 1 },
      })

      expect(setExpandedKeys).toHaveBeenCalledWith([1])
    })
  })

  describe('execOnAntdEvent', () => {
    it('should execute callback and prevent default', () => {
      const callback = jest.fn()
      const event = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      }
      const handler = execOnAntdEvent(callback)

      handler(event as any)

      expect(callback).toHaveBeenCalled()
      expect(event.stopPropagation).toHaveBeenCalled()
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should execute callback even if event methods are missing', () => {
      const callback = jest.fn()
      const event = {}
      const handler = execOnAntdEvent(callback)

      expect(() => {
        handler(event as any)
      }).not.toThrow()
      expect(callback).toHaveBeenCalled()
    })
  })
})
