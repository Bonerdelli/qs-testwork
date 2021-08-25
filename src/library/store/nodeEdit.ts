/**
 * Node editing application state
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Action, action } from 'easy-peasy'

import { TreeNode } from 'library/types'

export interface NodeEditStoreModel {
  activeId?: TreeNode['id'] | undefined
  editingId?: TreeNode['id'] | undefined
  setActiveId: Action<NodeEditStoreModel, TreeNode['id'] | undefined>
  setEditingId: Action<NodeEditStoreModel, TreeNode['id'] | undefined>
}

export const nodeEditModel: NodeEditStoreModel = {
  activeId: undefined,
  editingId: undefined,
  setActiveId: action((state, payload) => {
    state.activeId = payload
  }),
  setEditingId: action((state, payload) => {
    state.editingId = payload
  }),
}
