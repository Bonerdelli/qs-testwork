import { useState, useEffect } from 'react'
import { Row, Col, Card, Tree, Button, Skeleton } from 'antd'


import { DataItem } from './types'
import { useApiData } from './helpers/hooks'


import './TreeEditor.css'

export interface TreeNode {
  key: string
  title: string | JSX.Element
  disabled?: boolean
  children?: TreeNode[]
}

export const TreeEditor: React.FC = () => {
  const [tree] = useApiData<DataItem>(`/tree`)
  const [localTree] = useState<TreeNode[]>([]) // setLocalTree
  const [treeLoading, setTreeLoading] = useState<boolean>(true)
  useEffect(() => setLoading(!!tree), [tree])
  return (
    <Row align="middle" justify="center">
      <Col span={10}>
        <Card
          size="small"
          className="tree-card"
          title="База данных"
          actions={[]}
        >
          {treeLoading
            ? <Skeleton active />
            : <DBTreeView tree={tree} />}
        </Card>
      </Col>
      <Col span={10}>
        <Card
          size="small"
          className="tree-card"
          title="Редактирование"
          actions={[]}
        >
          <CachedTreeView />
        </Card>
      </Col>
    </Row>
  )
}
