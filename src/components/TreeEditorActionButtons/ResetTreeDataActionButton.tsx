/**
 * Reset tree database to initial state button component
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Button, Popconfirm, Tooltip } from 'antd'
import { PoweroffOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { useStoreState, useStoreActions } from 'library/store'
import { ActionButtonProps } from './types'

export const ResetTreeDataActionButton: React.FC<ActionButtonProps> = ({ title }) => {
  const { resetTreeData } = useStoreActions((state) => state.dbTree)
  const { clear: clearCashe } = useStoreActions((state) => state.cashedTreeNodes)
  const { setActiveId, setEditingId } = useStoreActions((state) => state.nodeEdit)
  const { apiErrors } = useStoreState((state) => state.dbTree)
  const renderIcon = () => {
    if (apiErrors.resetTree) {
      return (
        <Tooltip title={apiErrors.resetTree}>
          <ExclamationCircleFilled style={{ color: 'red' }} />
        </Tooltip>
      )
    }
    return <PoweroffOutlined />
  }
  const handleAction = async () => {
    const result = await resetTreeData()
    if (result) {
      setEditingId(undefined)
      setActiveId(undefined)
      clearCashe()
    }
  }
  return (
    <Popconfirm
      key="clear"
      title={
        <>
          База данных будет сброшена в первоначальное состояние
          <br />
          Данное действие нельзя отменить. Продолжить?
        </>
      }
      onConfirm={handleAction}
      okText="Да"
      cancelText="Нет"
      okType="danger"
    >
      <Button size="small" type="text" key="reload" title={title} danger={!!apiErrors.resetTree}>
        {renderIcon()}
        <span className="title">{title}</span>
      </Button>
    </Popconfirm>
  )
}
