/**
 * Reload database tree button component
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Button, Tooltip } from 'antd'
import { ReloadOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { useStoreState, useStoreActions } from 'library/store'
import { ActionButtonProps } from './types'

export const ReloadTreeActionButton: React.FC<ActionButtonProps> = ({ title }) => {
  const { reloadTree } = useStoreActions(state => state.dbTree)
  const { apiErrors } = useStoreState(state => state.dbTree)
  const renderIcon = () => {
    if (apiErrors.loadData) {
      return (
        <Tooltip title={apiErrors.loadData}>
          <ExclamationCircleFilled style={{ color: 'red' }} />
        </Tooltip>
      )
    }
    return (
      <ReloadOutlined />
    )
  }
  return (
    <Button
      size="small"
      type="text"
      key="reload"
      title={title}
      onClick={() => reloadTree()}
      danger={!!apiErrors.loadData}
    >
      {renderIcon()}
      <span className="title">{title}</span>
    </Button>
  )
}
