/**
 * Tree editor component
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { useEffect } from 'react'
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
} from 'components/TreeEditorActionButtons'

import './TreeEditor.css'

export const TreeEditor: React.FC = () => {
  const {
    tree,
    isLoading,
    apiErrors,
    savedSuccessfully,
    addedNodeIds,
  } = useStoreState(state => state.dbTree)

  const {
    nodes: cashedNodes,
    isLoading: isCashedNodesLoading,
  } = useStoreState(state => state.cashedTreeNodes)

  const {
    clearAddedAndDeleted,
    refreshNodesById,
    setLoading: setCashedNodesLoading,
  } = useStoreActions(state => state.cashedTreeNodes)

  const { clear: clearTree, reloadTree } = useStoreActions(state => state.dbTree)

  useEffect(() => {
    setCashedNodesLoading(true)
    reloadTree()
  }, [])

  useEffect(() => {
    console.log('TreeEditor : Initialize')
    setCashedNodesLoading(false)
  }, [cashedNodes])

  useEffect(() => {
    if (savedSuccessfully) {
      clearTree()
      reloadTree()
      setCashedNodesLoading(true)
      const nodeIds = cashedNodes
        .filter(node => !node.isDeleted)
        .map(node => node.id)
      clearAddedAndDeleted()
      refreshNodesById([
        ...addedNodeIds ?? [],
        ...nodeIds,
      ])
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
    if (!tree && isLoading) {
      return (
        <Skeleton active />
      )
    }
    return (
      <DBTreeView />
    )
  }

  const renderCachedTreeView = () => {
    if (isCashedNodesLoading) {
      return (
        <Skeleton active />
      )
    }
    if (!cashedNodes?.length) {
      return (
        <Empty
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
        <Col span={10}>
          <Card
            size="small"
            className="tree-card"
            title="База данных"
            actions={[
              <ReloadTreeActionButton key="reload" title="Обновить" />,
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
