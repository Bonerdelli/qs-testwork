import { useState } from 'react'
import { Row, Col, Tree } from 'antd'

import leftTreeData from './mock/antd-tree' // TODO: replace with fake API

export interface TreeNode {
  key: string
  title: string | JSX.Element
  disabled?: boolean
  children?: TreeNode[]
}

export const TreeSelect: React.FC = () => {
  const [localTree] = useState<TreeNode[]>([]) // setLocalTree
  return (
    <Row>
      <Col span={12}>
        <Tree
          treeData={leftTreeData}
        />
      </Col>
      <Col span={12}>
        <Tree
          treeData={localTree}
        />
      </Col>
    </Row>
  )
}
