import { Layout } from 'antd'

import { TreeSelect } from './TreeSelect'

import './App.css'

const { Content } = Layout

function App(): JSX.Element {
  return (
    <Layout style={{ height: '100%' }}>
      <Content className="content">
        <TreeSelect />
      </Content>
    </Layout>
  )
}

export default App
