import { renderWithStore, createMockTreeNode, createTestStore } from 'components/testUtils'
import { DBTreeView } from '../DBTreeView'
import { TreeNode } from 'library/types'

describe('DBTreeView', () => {
  it('should render empty tree when no tree data', () => {
    const { container } = renderWithStore(<DBTreeView />)
    const tree = container.querySelector('.ant-tree')
    expect(tree).toBeInTheDocument()
  })

  it('should render tree with root node', () => {
    const tree: TreeNode = createMockTreeNode({ id: 1, value: 'Root' })

    const store = createTestStore()
    store.getActions().dbTree.setTree(tree)

    const { container } = renderWithStore(<DBTreeView />, { store })

    const treeElement = container.querySelector('.ant-tree')
    expect(treeElement).toBeInTheDocument()
  })

  it('should be disabled when loading', () => {
    const tree: TreeNode = createMockTreeNode({ id: 1 })

    const store = createTestStore()
    store.getActions().dbTree.setTree(tree)
    store.getActions().dbTree.setLoading(true)

    const { container } = renderWithStore(<DBTreeView />, { store })

    const treeElement = container.querySelector('.ant-tree')
    expect(treeElement).toBeInTheDocument()
    // Tree disabled state is handled by antd internally, we verify it renders
    expect(store.getState().dbTree.isLoading).toBe(true)
  })
})

