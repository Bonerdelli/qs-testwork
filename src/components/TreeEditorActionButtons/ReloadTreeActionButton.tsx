/**
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { ActionButtonProps } from './types'

import { useStoreActions } from 'library/store'

export const ReloadTreeActionButton: React.FC<ActionButtonProps> = ({ title }) => {
  const { reloadTree } = useStoreActions(state => state.dbTree)
  return (
    <Button
      size="small"
      type="text"
      key="reload"
      onClick={() => reloadTree()}
    >
      <ReloadOutlined />
      {title}
    </Button>
  )
}
