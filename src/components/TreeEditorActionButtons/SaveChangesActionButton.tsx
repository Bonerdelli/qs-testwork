/**
 * Action button component to save local changes into database
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { useState, useEffect } from 'react'
import { Modal, Tooltip, Button } from 'antd'
import {
  WarningFilled,
  ExclamationCircleFilled,
  DoubleLeftOutlined,
} from '@ant-design/icons'

import { useStoreState, useStoreActions } from 'library/store'
import { TreeNode } from 'library/types'
import { ActionButtonProps } from './types'

export const SaveChangesActionButton: React.FC<ActionButtonProps> = ({ title }) => {
  const { apiErrors, confirmOverwriteIds } = useStoreState(state => state.dbTree)
  const { nodes: cashedNodes, nodeIds: cashedNodesIds, isChanged } = useStoreState(state => state.cashedTreeNodes)
  const { setEditingId } = useStoreActions(state => state.nodeEdit)
  const { saveChanges } = useStoreActions(state => state.dbTree)

  const [modalOpened, setModalOpened] = useState<boolean>(false)
  const [nodeIds, setNodeIds] = useState<number[]>([])

  useEffect(() => {
    if (confirmOverwriteIds?.length) {
      setNodeIds([...confirmOverwriteIds])
      setModalOpened(true)
    } else {
      setNodeIds([])
    }
  }, [confirmOverwriteIds])

  const handleSave = () => {
    saveChanges([cashedNodes])
    setEditingId(undefined)
  }

  const handleSaveWithOwervrite = async () => {
    saveChanges([cashedNodes, nodeIds])
    setEditingId(undefined)
    setModalOpened(false)
  }

  const renderIcon = () => {
    if (nodeIds?.length) {
      return (
        <Tooltip title="Требуется подтверждение">
          <WarningFilled style={{ color: '#ffb220' }} />
        </Tooltip>
      )
    }
    if (apiErrors.saveChanges) {
      return (
        <Tooltip title={apiErrors.saveChanges}>
          <ExclamationCircleFilled style={{ color: 'red' }} />
        </Tooltip>
      )
    }
    return (
      <DoubleLeftOutlined />
    )
  }

  const getNodeValue = (id: TreeNode['id']) => {
    const index = cashedNodesIds.indexOf(id)
    return cashedNodes[index]?.value
  }

  return (
    <>
      <Button
        size="small"
        type="text"
        key="save"
        title={title}
        danger={!!apiErrors.saveChanges}
        disabled={cashedNodes?.length === 0 || !isChanged}
        onClick={handleSave}
      >
        {renderIcon()}
        <span className="title">{title}</span>
      </Button>
      <Modal
        title="Требуется подтверждение"
        visible={modalOpened}
        onOk={handleSaveWithOwervrite}
        onCancel={() => setModalOpened(false)}
        okText="Перезаписать"
        cancelText="Отмена"
      >
        <p>
          Следующие элементы были изменены с момента поледнего редактирования.
          Перезаписать изменения с текущими (локальными) правками?
        </p>
        <ul>
          {nodeIds?.map(id => (
            <li key={id.toString()}>
              <strong>{getNodeValue(id)}</strong>
              <span> (ID: {id})</span>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
