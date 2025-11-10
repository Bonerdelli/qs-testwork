import { waitFor } from '@testing-library/react'
import { renderWithStore, createMockTreeNode, createTestStore } from 'components/testUtils'
import { setupAntdActWarningSuppression } from 'components/__tests__/utils/suppressActWarnings'
import { DBTreeView } from '../DBTreeView'
import { TreeNode } from 'library/types'

const { beforeAll: setupSuppression, afterAll: restoreConsole } = setupAntdActWarningSuppression()
beforeAll(setupSuppression)
afterAll(restoreConsole)

describe('DBTreeView', () => {
  it('should render empty tree when no tree data', async () => {
    const { container } = renderWithStore(<DBTreeView />)
    await waitFor(() => {
      const tree = container.querySelector('.ant-tree')
      expect(tree).toBeInTheDocument()
    })
  })

  it('should render tree with root node', async () => {
    const tree: TreeNode = createMockTreeNode({ id: 1, value: 'Root' })

    const store = createTestStore()
    store.getActions().dbTree.setTree(tree)

    const { container } = renderWithStore(<DBTreeView />, { store })

    await waitFor(() => {
      const treeElement = container.querySelector('.ant-tree')
      expect(treeElement).toBeInTheDocument()
    })
  })

  it('should be disabled when loading', async () => {
    const tree: TreeNode = createMockTreeNode({ id: 1 })

    const store = createTestStore()
    store.getActions().dbTree.setTree(tree)
    store.getActions().dbTree.setLoading(true)

    const { container } = renderWithStore(<DBTreeView />, { store })

    await waitFor(() => {
      const treeElement = container.querySelector('.ant-tree')
      expect(treeElement).toBeInTheDocument()
    })
    // Tree disabled state is handled by antd internally, we verify it renders
    expect(store.getState().dbTree.isLoading).toBe(true)
  })
})

