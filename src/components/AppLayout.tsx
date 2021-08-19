import { Layout } from 'antd'

import { TreeEditor } from 'components/TreeEditor'

const { Content } = Layout

export const AppLayout: React.FC = () => (
  <Layout style={{ height: '100%' }}>
    <Content className="content">
      <TreeEditor />
    </Content>
  </Layout>
)
