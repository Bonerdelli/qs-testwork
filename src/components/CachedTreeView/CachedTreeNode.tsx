import { TreeNode } from '../../types'

export interface CachedTreeNodeProps {
  nodeId: TreeNode['id']
}

// Содержимое следующих узлов изменилось с момента их загрузки:

// Перезаписать их с локальными правками?

// Отмена | Сбросить изменения | Перезаписать

// Все локальные изменения будут сброшены. Вы уверены?

export const CachedTreeNode: React.FC<CachedTreeNodeProps> = ({ nodeId }) => (
  <>{nodeId}</>
)
