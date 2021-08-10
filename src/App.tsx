import { Layout } from 'antd'

import { TreeEditor } from './components/TreeEditor'

import './App.css'

const { Content } = Layout

function App(): JSX.Element {
  return (
    <Layout style={{ height: '100%' }}>
      <Content className="content">
        <TreeEditor />
      </Content>
    </Layout>
  )
}

export default App
