// import { useState, useEffect } from 'react'
import { Row, Col, Card, Skeleton } from 'antd'

import { TreeNode } from '../../types'
import { useApiData } from '../../helpers/hooks'
import { DBTreeView } from '../DBTreeView'
import { CachedTreeView } from '../CachedTreeView'

import './TreeEditor.css'

export const TreeEditor: React.FC = () => {
  const [tree] = useApiData<TreeNode>('/tree')
  // const [localTree] = useState<TreeNode[]>([]) // setLocalTree
  // const [treeLoading, setTreeLoading] = useState<boolean>(true)
  // useEffect(() => setTreeLoading(!!tree), [tree])
  return (
    <Row align="middle" justify="center">
      <Col span={10}>
        <Card
          size="small"
          className="tree-card"
          title="База данных"
          actions={[]}
        >
          {tree
            ? <DBTreeView tree={tree} />
            : <Skeleton active />}
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
