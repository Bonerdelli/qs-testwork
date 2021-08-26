/**
 * Tree editor component
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { useState, useEffect } from 'react'
import { Row, Col, Card, Skeleton, Result, Empty } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { useStoreState, useStoreActions } from 'library/store'
import { DBTreeView } from 'components/DBTreeView'
import { CachedTreeView } from 'components/CachedTreeView'

import {
  ClearCacheActionButton,
  ReloadCacheActionButton,
  ReloadTreeActionButton,
  SaveChangesActionButton,
  ResetTreeDataActionButton,
} from 'components/TreeEditorActionButtons'

import './TreeEditor.css'

export const TreeEditor: React.FC = () => {
  const {
    tree,
    apiErrors,
    savedSuccessfully,
    addedNodeIds,
  } = useStoreState(state => state.dbTree)

  const {
    nodes: cashedNodes,
    isLoading: isCacheLoadingState,
  } = useStoreState(state => state.cashedTreeNodes)

  const {
    clearNodeStatuses,
    refreshNodesById,
    clear: clearCashedNodes,
  } = useStoreActions(state => state.cashedTreeNodes)

  const { reloadTree } = useStoreActions(state => state.dbTree)

  const [cacheLoading, setCacheLoading] = useState<boolean>()

  useEffect(() => {
    setCacheLoading(true)
    reloadTree()
  }, [])

  useEffect(() => {
    setCacheLoading(isCacheLoadingState)
  }, [isCacheLoadingState])

  useEffect(() => {
    setTimeout(() => setCacheLoading(false))
  }, [cashedNodes])

  useEffect(() => {
    const reloadCb = async () => {
      setCacheLoading(true)
      await reloadTree()
      const nodeIds = cashedNodes
        .map(node => node.id)
      clearNodeStatuses()
      clearCashedNodes()
      await refreshNodesById([
        ...addedNodeIds ?? [],
        ...nodeIds,
      ])
      setCacheLoading(false)
    }
    if (savedSuccessfully) {
      reloadCb()
    }
  }, [savedSuccessfully, addedNodeIds])

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
    if (!tree) {
      return (
        <Skeleton active />
      )
    }
    return (
      <DBTreeView />
    )
  }

  const renderCachedTreeView = () => {
    if (cacheLoading) {
      return (
        <Skeleton active />
      )
    }
    if (!cashedNodes?.length) {
      return (
        <Empty
          className="tree-editor-empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={(<>Загрузите элементы,<br /> чтобы начать редактирование</>)}
        />
      )
    }
    return (
      <CachedTreeView />
    )
  }

  return (
    <>
      <Row justify="center" className="tree-editor-layout">
        <Col span={12} xl={10}>
          <Card
            size="small"
            className="tree-card"
            title="База данных"
            actions={[
              <ReloadTreeActionButton key="reload" title="Обновить" />,
              <ResetTreeDataActionButton key="reset" title="Сбросить" />,
            ]}
          >
            {renderDbTree()}
          </Card>
        </Col>
        <Col span={12} xl={10}>
          <Card
            size="small"
            className="tree-card"
            title="Редактирование (локальный кэш)"
            actions={[
              <SaveChangesActionButton key="save" title="Сохранить" />,
              <ReloadCacheActionButton key="reload" title="Перечитать" />,
              <ClearCacheActionButton key="clear" title="Очистить" />,
            ]}
          >
            {renderCachedTreeView()}
          </Card>
        </Col>
      </Row>
    </>
  )
}
