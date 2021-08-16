// TODO: hide button labels based on screen width

import { useState } from 'react'
import { Row, Col, Card, Skeleton, Popconfirm, Result, Button } from 'antd'
import {
  ReloadOutlined,
  DoubleLeftOutlined,
  ClearOutlined,
  SyncOutlined,
} from '@ant-design/icons'

import { TreeNode } from '../../types'
import { useApiData } from '../../helpers/hooks'
import { useStoreState, useStoreActions } from '../../store'
import { DBTreeView } from '../DBTreeView'
import { CachedTreeView } from '../CachedTreeView'

import './TreeEditor.css'

export const TreeEditor: React.FC = () => {
  const { nodes: cashedNodes } = useStoreState(state => state.cashedTreeNodes)
  const { clear: cashedNodesClear } = useStoreActions(state => state.cashedTreeNodes)

  const [tree, setData, loadData] = useApiData<TreeNode>('/tree', e => setApiError(e?.message))
  // const [localTree] = useState<TreeNode[]>([]) // setLocalTree
  // const [treeLoading, setTreeLoading] = useState<boolean>(true)
  // useEffect(() => setTreeLoading(!!tree), [tree])
  const [apiError, setApiError] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>()

  const handleReload = async () => {
    setLoading(true)
    setApiError(undefined)
    const data = await loadData()
    data && setData(data)
    setLoading(false)
  }

  const handleSave = () => {

  }

  const handleSync = () => {

  }

  const renderDbTree = () => {
    if (typeof apiError !== 'undefined') {
      return (
        <Result
          status="error"
          title="Ошибка загрузки данных"
          subTitle={apiError}
        />
      )
    }
    if (tree) {
      return (
        <DBTreeView tree={tree} loading={loading} />
      )
    }
    return (
      <Skeleton active />
    )
  }

  return (
    <Row justify="center">
      <Col span={10}>
        <Card
          size="small"
          className="tree-card"
          title="База данных"
          actions={[
            <Button
              size="small"
              type="text"
              key="reload"
              onClick={handleReload}
            >
              <ReloadOutlined />
              Обновить
            </Button>,
          ]}
        >
          {renderDbTree()}
        </Card>
      </Col>
      <Col span={10}>
        <Card
          size="small"
          className="tree-card"
          title="Редактирование (локальный кэш)"
          actions={[
            <Button
              size="small"
              type="text"
              key="save"
              disabled={cashedNodes?.length === 0}
              onClick={handleSave}
            >
              <DoubleLeftOutlined />
              Сохранить
            </Button>,
            <Popconfirm
              key="clear"
              title={(
                <>
                  Данные узлов будут перезагружены<br />
                  Внесённые изменения будут потеряны<br />
                  Продолжить?
                </>
              )}
              onConfirm={() => cashedNodesClear()}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                size="small"
                type="text"
                key="save"
                disabled={cashedNodes?.length === 0}
                onClick={handleSync}
              >
                <SyncOutlined />
                Перечитать
              </Button>
            </Popconfirm>,
            <Popconfirm
              key="clear"
              title={<>Внесённые изменения будут потеряны<br />Продолжить?</>}
              onConfirm={() => cashedNodesClear()}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                size="small"
                type="text"
                disabled={cashedNodes?.length === 0}
              >
                <ClearOutlined />
                Очистить
              </Button>
            </Popconfirm>,
          ]}
        >
          <CachedTreeView />
        </Card>
      </Col>
    </Row>
  )
}
