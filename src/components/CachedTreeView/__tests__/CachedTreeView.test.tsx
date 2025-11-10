import { waitFor } from '@testing-library/react'
import { renderWithStore, createMockTreeNode, createTestStore } from 'components/testUtils'
import { setupAntdActWarningSuppression } from 'components/__tests__/utils/suppressActWarnings'
import { CachedTreeView } from '../CachedTreeView'
import { TreeNode } from 'library/types'

const { beforeAll: setupSuppression, afterAll: restoreConsole } = setupAntdActWarningSuppression()
beforeAll(setupSuppression)
afterAll(restoreConsole)

describe('CachedTreeView', () => {
  it('should render empty tree when no nodes', async () => {
    const { container } = renderWithStore(<CachedTreeView />)
    await waitFor(() => {
      const tree = container.querySelector('.cashed-tree')
      expect(tree).toBeInTheDocument()
    })
  })

  it('should render tree with nodes', async () => {
    const nodes: TreeNode[] = [
      createMockTreeNode({ id: 1, value: 'Node 1' }),
      createMockTreeNode({ id: 2, value: 'Node 2', parent: 1 }),
    ]

    const store = createTestStore()
    store.getActions().cashedTreeNodes.addNode(nodes[0])
    store.getActions().cashedTreeNodes.addNode(nodes[1])

    const { container } = renderWithStore(<CachedTreeView />, { store })

    await waitFor(() => {
      const tree = container.querySelector('.cashed-tree')
      expect(tree).toBeInTheDocument()
    })
  })
})

