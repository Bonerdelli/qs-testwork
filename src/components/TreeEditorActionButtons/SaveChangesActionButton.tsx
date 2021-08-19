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

  const [confirmationModalOpened, setConfirmationModalOpened] = useState<boolean>(false)

  useEffect(() => {
    if (confirmOverwriteIds?.length) {
      setConfirmationModalOpened(true)
    }
  }, [confirmOverwriteIds])

  const handleSave = () => {
    saveChanges([cashedNodes])
  }

  const handleSaveWithOwervrite = () => {
    saveChanges([cashedNodes, confirmOverwriteIds])
    setConfirmationModalOpened(false)
  }

  const renderIcon = () => {
    if (confirmOverwriteIds?.length) {
      return (
        <Tooltip title={apiErrors.saveChanges}>
          <WarningFilled style={{ color: 'yellow' }} />
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
        visible={confirmationModalOpened}
        onOk={handleSaveWithOwervrite}
        onCancel={() => setConfirmationModalOpened(false)}
        okText="Перезаписать"
        cancelText="Отмена"
      >
        <p>
          Следующие элементы были изменены с момента поледнего редактирования.
          Перезаписать изменения с текущими (локальными) правками?
        </p>
        <ul>
          {confirmOverwriteIds?.map(id => (
            <li key={id.toString()}>{id}</li>
          ))}
        </ul>
        <SaveChangesActionButton title="test" />
      </Modal>
    </>
  )
}
