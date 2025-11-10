import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { StoreProvider } from 'easy-peasy'
import { createStore, Store } from 'easy-peasy'
import { AppStoreModel } from 'library/store/store'
import { cashedTreeNodesStoreModel } from 'library/store/cashedTreeNodes'
import { dbTreeStoreModel } from 'library/store/dbTree'
import { nodeEditModel } from 'library/store/nodeEdit'
import { TreeNode } from 'library/types'

export function createTestStore(initialState?: Partial<AppStoreModel>): Store<AppStoreModel> {
  const storeModel: AppStoreModel = {
    dbTree: dbTreeStoreModel,
    cashedTreeNodes: cashedTreeNodesStoreModel,
    nodeEdit: nodeEditModel,
    ...initialState,
  }
  return createStore(storeModel)
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: Store<AppStoreModel>
  initialState?: Partial<AppStoreModel>
}

export function renderWithStore(
  ui: React.ReactElement,
  options: CustomRenderOptions = {},
) {
  const { store, initialState, ...renderOptions } = options
  const testStore = store || createTestStore(initialState)

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <StoreProvider store={testStore}>
      {children}
    </StoreProvider>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store: testStore,
  }
}

export function createMockTreeNode(overrides?: Partial<TreeNode>): TreeNode {
  return {
    id: 1,
    value: 'Test Node',
    parent: 0,
    ...overrides,
  }
}

