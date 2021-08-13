// TODO: change title and favicon
// TODO: put test work description in repo
// TODO: Обшибка загрузки данных. Произошла ошибка при попытке получить данные с сервера

import { StoreProvider } from 'easy-peasy'
import { PersistGate } from 'redux-persist/integration/react'
import { Spin } from 'antd'

import { AppLayout } from './components/AppLayout'
import { store, persistor } from './store'

// NOTE: we don't need preprocessor here,
// because styles aren't complex
import './App.css'

function App(): JSX.Element {
  const renderLoading = () => (
    <Spin />
  )
  return (
    <PersistGate loading={renderLoading()} persistor={persistor}>
      <StoreProvider store={store}>
        <AppLayout />
      </StoreProvider>
    </PersistGate>
  )
}

export default App
