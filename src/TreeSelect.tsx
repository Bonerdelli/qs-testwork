import { useState, useEffect } from 'react'
import { Row, Col, Card, Tree, Button, Skeleton } from 'antd'
import { DataNode } from 'antd/es/tree'

import { DataItem } from './types'
import { useApiData } from './helpers/hooks'
import { treeDataToNodes } from './helpers/tree'

import './TreeSelect.css'

export interface TreeNode {
  key: string
  title: string | JSX.Element
  disabled?: boolean
  children?: TreeNode[]
}

export const TreeSelect: React.FC = () => {
  const [treeData] = useApiData<DataItem>(`/tree`)
  const [tree, setTree] = useState<DataNode[]>()
  const [localTree] = useState<TreeNode[]>([]) // setLocalTree
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    if (treeData) {
      const treeNodes = treeDataToNodes(treeData)
      setTree([treeNodes])
      setLoading(false)
    }
  }, [treeData])
  if (loading) {
    return <Skeleton active />
  }
  return (
    <Row align="middle" justify="center">
      <Col span={10}>
        <Card
          size="small"
          className="tree-card"
          title="База данных"
          actions={[
            <Button key="download" type="primary">Выгрузить</Button>,
          ]}
        >
          <Tree
            treeData={tree}
            draggable={false}
            defaultExpandedKeys={['0-0']}
          />
        </Card>
      </Col>
      <Col span={10}>
        <Card
          size="small"
          className="tree-card"
          title="Редактирование"
          actions={[
            <Button key="edit">Редактировать</Button>,
            <Button key="delete" danger>Удалить</Button>,
            <Button key="upload" type="primary">Сохранить</Button>,
          ]}
        >
          <Tree
            treeData={localTree}
            draggable={false}
            checkable
            multiple={false}
            defaultExpandedKeys={['0-0']}
          />
        </Card>
      </Col>
    </Row>
  )
}
