import { useState } from 'react'
import { Row, Col, Card, Tree, Button } from 'antd'

import leftTreeData from './mock/antd-tree' // TODO: replace with fake API

import './TreeSelect.css'

export interface TreeNode {
  key: string
  title: string | JSX.Element
  disabled?: boolean
  children?: TreeNode[]
}

export const TreeSelect: React.FC = () => {
  const [localTree] = useState<TreeNode[]>([]) // setLocalTree
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
            treeData={leftTreeData}
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
