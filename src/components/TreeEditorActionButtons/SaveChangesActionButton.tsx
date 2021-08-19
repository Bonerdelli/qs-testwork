/**
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { useState, useEffect } from 'react'
import { Modal, Tooltip, Button } from 'antd'
import { WarningFilled, ExclamationCircleFilled, DoubleLeftOutlined } from '@ant-design/icons'
import { ActionButtonProps } from './types.d'

import { useStoreState, useStoreActions } from '../../store'

export const SaveChangesActionButton: React.FC<ActionButtonProps> = ({ title }) => {
  const { apiErrors, confirmOverwriteIds } = useStoreState(state => state.dbTree)
  const { nodes: cashedNodes, isChanged } = useStoreState(state => state.cashedTreeNodes)
  const { saveChanges } = useStoreActions(state => state.dbTree)

  const [modalOpened, setModalOpened] = useState<boolean>(false)
  const [nodeIds, setNodeIds] = useState<number[]>([])

  useEffect(() => {
    console.log('SaveChangesActionButton : Initialize')
  }, [])

  useEffect(() => {
    if (confirmOverwriteIds?.length) {
      console.log('setNodeIds', confirmOverwriteIds)
      setNodeIds([...confirmOverwriteIds])
      setModalOpened(true)
    }
  }, [confirmOverwriteIds])

  const handleSave = () => {
    saveChanges([cashedNodes])
  }

  const handleSaveWithOwervrite = () => {
    saveChanges([cashedNodes, nodeIds])
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

  return (
    <>
      <Button
        size="small"
        type="text"
        key="save"
        danger={!!apiErrors.saveChanges}
        disabled={cashedNodes?.length === 0 || !isChanged}
        onClick={handleSave}
      >
        {renderIcon()}
        {title}
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
            <li key={id.toString()}>{id}</li>
          ))}
        </ul>
        <SaveChangesActionButton title="test" />
      </Modal>
    </>
  )
}
