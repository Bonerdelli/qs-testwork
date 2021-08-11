import { createStore, createTypedHooks } from 'easy-peasy'
import { PersistConfig, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { CashedTreeNodesStoreModel, cashedTreeNodesStoreModel } from './cashedTreeNodes'
import { DbTreeStoreModel, dbTreeStoreModel } from './dbTree'

export const STORAGE_KEY_PREFIX = 'qs-testwork'

export interface AppStoreModel {
  cashedTreeNodes: CashedTreeNodesStoreModel
  dbTree: DbTreeStoreModel
}

const persistBaseConfig = {
  key: STORAGE_KEY_PREFIX,
  storage,
}

const persistRootConfig: PersistConfig<AppStoreModel> = {
  ...persistBaseConfig,
  whitelist: [
    'cashedTreeNodes',
  ],
}

const model = {
  cashedTreeNodes: cashedTreeNodesStoreModel,
  dbTree: dbTreeStoreModel,
}

export const store = createStore<AppStoreModel>(model, {
  reducerEnhancer: reducer => persistReducer(
    persistRootConfig,
    reducer,
  ),
})

const typedHooks = createTypedHooks<AppStoreModel>()
export const { useStoreActions } = typedHooks
export const { useStoreDispatch } = typedHooks
export const { useStoreState } = typedHooks

export const persistor = persistStore(store)
export default store
