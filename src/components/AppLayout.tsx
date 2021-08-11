import { Layout } from 'antd'
const { Content } = Layout

import { TreeEditor } from './TreeEditor'

export const AppLayout: React.FC = () => (
  <Layout style={{ height: '100%' }}>
    <Content className="content">
      <TreeEditor />
    </Content>
  </Layout>
)
