import { createStore, createTypedHooks } from 'easy-peasy'
import { PersistConfig, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { CashedTreeNodesStoreModel, cashedTreeNodesStoreModel } from './cashedTreeNodes'
import { DbTreeStoreModel, dbTreeStoreModel } from './dbTree'
import { NodeEditStoreModel, nodeEditModel } from './nodeEdit'

export const STORAGE_KEY_PREFIX = 'qs-testwork-1.1.0'

export interface AppStoreModel {
  dbTree: DbTreeStoreModel
  cashedTreeNodes: CashedTreeNodesStoreModel
  nodeEdit: NodeEditStoreModel
}

const persistBaseConfig = {
  key: STORAGE_KEY_PREFIX,
  storage,
}

const persistRootConfig: PersistConfig<AppStoreModel> = {
  ...persistBaseConfig,
  whitelist: ['cashedTreeNodes'],
}

const appStoreModel = {
  dbTree: dbTreeStoreModel,
  cashedTreeNodes: cashedTreeNodesStoreModel,
  nodeEdit: nodeEditModel,
}

export const store = createStore<AppStoreModel>(appStoreModel, {
  reducerEnhancer: (reducer) => persistReducer(persistRootConfig, reducer),
})

const typedHooks = createTypedHooks<AppStoreModel>()
export const { useStoreActions } = typedHooks
export const { useStoreDispatch } = typedHooks
export const { useStoreState } = typedHooks

export const persistor = persistStore(store)
export default store
