import { renderWithStore, createMockTreeNode, createTestStore } from 'components/testUtils'
import { CachedTreeView } from '../CachedTreeView'
import { TreeNode } from 'library/types'

describe('CachedTreeView', () => {
  it('should render empty tree when no nodes', () => {
    const { container } = renderWithStore(<CachedTreeView />)
    const tree = container.querySelector('.cashed-tree')
    expect(tree).toBeInTheDocument()
  })

  it('should render tree with nodes', () => {
    const nodes: TreeNode[] = [
      createMockTreeNode({ id: 1, value: 'Node 1' }),
      createMockTreeNode({ id: 2, value: 'Node 2', parent: 1 }),
    ]

    const store = createTestStore()
    store.getActions().cashedTreeNodes.addNode(nodes[0])
    store.getActions().cashedTreeNodes.addNode(nodes[1])

    const { container } = renderWithStore(<CachedTreeView />, { store })

    const tree = container.querySelector('.cashed-tree')
    expect(tree).toBeInTheDocument()
  })
})

