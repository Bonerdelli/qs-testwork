// TODO: hide button labels based on screen width

import { useEffect } from 'react'
import { Row, Col, Card, Skeleton, Popconfirm, Result, Tooltip, Button } from 'antd'
import {
  ReloadOutlined,
  DoubleLeftOutlined,
  ClearOutlined,
  SyncOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

import { useStoreState, useStoreActions } from '../../store'
import { DBTreeView } from '../DBTreeView'
import { CachedTreeView } from '../CachedTreeView'

import './TreeEditor.css'

export const TreeEditor: React.FC = () => {
  const { tree, isLoading, apiErrors, confirmOverwriteIds } = useStoreState(state => state.dbTree)
  const { nodes: cashedNodes, isChanged, apiError: cashedApiError } = useStoreState(state => state.cashedTreeNodes)
  const { clear: cashedNodesClear, refreshNodesById } = useStoreActions(state => state.cashedTreeNodes)
  const { reloadTree, saveChanges } = useStoreActions(state => state.dbTree)

  useEffect(() => reloadTree(), [])

  const handleCacheReload = () => {
    const ids = cashedNodes.map(node => node.id)
    refreshNodesById(ids)
  }

  console.log('confirmOverwriteIds', confirmOverwriteIds)
  console.log('isChanged', isChanged)

  const renderDbTree = () => {
    if (apiErrors.loadData) {
      return (
        <Result
          status="error"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          title="Ошибка загрузки данных"
          subTitle={apiErrors.loadData}
        />
      )
    }
    if (!tree && isLoading) {
      return (
        <Skeleton active />
      )
    }
    return (
      <DBTreeView />
    )
  }

  // TODO: move out actions outside component?
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
              onClick={() => reloadTree()}
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
              danger={!!apiErrors.saveChanges}
              disabled={cashedNodes?.length === 0 || !isChanged}
              onClick={() => saveChanges(cashedNodes)}
            >
              {apiErrors.saveChanges ? (
                <Tooltip title={apiErrors.saveChanges}>
                  <ExclamationCircleFilled style={{ color: 'red' }} />
                </Tooltip>
              ) : <DoubleLeftOutlined />}
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
              onConfirm={() => handleCacheReload()}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                size="small"
                type="text"
                key="save"
                disabled={cashedNodes?.length === 0}
                danger={!!cashedApiError}
              >
                {cashedApiError ? (
                  <Tooltip title={cashedApiError}>
                    <ExclamationCircleFilled style={{ color: 'red' }} />
                  </Tooltip>
                ) : <SyncOutlined />}
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
