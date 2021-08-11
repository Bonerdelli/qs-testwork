import { createStore, createTypedHooks } from 'easy-peasy'
import { PersistConfig, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { CashedTreeStoreModel, cashedTreeStoreModel } from './cashedTree'
import { DbTreeStoreModel, dbTreeStoreModel } from './dbTree'

export const STORAGE_KEY_PREFIX = 'qs-testwork'

export interface AppStoreModel {
  cashedTree: CashedTreeStoreModel
  dbTree: DbTreeStoreModel
}

const persistBaseConfig = {
  key: STORAGE_KEY_PREFIX,
  storage,
}

const persistRootConfig: PersistConfig<AppStoreModel> = {
  ...persistBaseConfig,
  whitelist: [
    'cashedTree',
  ],
}

const model = {
  cashedTree: cashedTreeStoreModel,
  dbTree: dbTreeStoreModel,
}

export const store = createStore<AppStoreModel>(model, {
  reducerEnhancer: reducer => persistReducer(
    persistRootConfig,
    reducer
  )
})

const typedHooks = createTypedHooks<AppStoreModel>()
export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState

export const persistor = persistStore(store)
export default store
