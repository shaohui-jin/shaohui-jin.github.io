import type { Graph } from '@antv/x6'
import { MiniMap, History, Snapline, Clipboard, Selection } from '@antv/x6'

/**
 * 注册X6插件
 * 初始化画布所需的各种功能插件
 * @param graph X6画布实例
 * @param container 画布容器元素
 * @param minimapContainer 迷你图容器元素
 */
export function registerX6Plugins(
  graph: Graph,
  container: HTMLElement | undefined,
  minimapContainer: HTMLElement | undefined
) {
  // 注册对齐线插件
  graph.use(
    new Snapline({
      enabled: true,
      tolerance: 10,
      sharp: true,
      resizing: true,
      clean: 3000,
      className: 'snapline'
    })
  )

  // 注册撤销恢复插件
  graph.use(
    new History({
      enabled: true,
      stackSize: 100,
      ignoreAdd: false,
      ignoreRemove: false,
      ignoreChange: false,
      beforeAddCommand: (event: any, args: any) => {
        // console.log('beforeAddCommand', args)
        // 忽略工具的撤销恢复
        if (args?.key === 'tools') {
          return false
        }
        // 忽略虚拟边
        if (args?.cell?.id?.startsWith('virtual_')) {
          return false
        }
        // 忽略指定节点
        if (args?.options?.ignoreHistory === true) {
          return false
        }
        // 备注信息的显示隐藏
        // if (args?.cell.shape === 'infoPanelNode') {
        //   // 忽略信息面板节点的撤销恢复
        //   return false
        // }
        // if (args.options.propertyPath === 'attrs/foldButton/xlink:href') {
        //   return false
        // }
        // 修复bug244611
        // if (args.options.propertyPath === 'attrs/line/strokeWidth') {
        //   return false
        // }
        // if (args?.options && Object.keys(args.options).length === 0) {
        //   return false
        // }
        // 忽略桩点的收缩和展开
        // if (args?.key === 'ports' && args?.options?.ignoreHistory === true) {
        //   return false
        // }
      }
    })
  )

  // 注册复制粘贴插件
  graph.use(new Clipboard({ enabled: true }))

  // 注册选中插件
  const selectionPluginInstance = new Selection({
    enabled: true,
    multiple: true,
    rubberband: true,
    modifiers: 'ctrl',
    movable: true,
    showNodeSelectionBox: true,
    showEdgeSelectionBox: false
  })
  graph.use(selectionPluginInstance)

  // 初始化画布缩放
  container?.addEventListener('wheel', e => {
    e.preventDefault()
    const delta = e.deltaY
    const currentScale = graph.zoom()
    const newScale = delta > 0 ? currentScale - 0.1 : currentScale + 0.1
    const finalScale = Math.min(Math.max(newScale, 0.2), 3)
    graph.zoom(finalScale, { absolute: true })
  })

  // 初始化迷你图
  if (minimapContainer) {
    const minimap = new MiniMap({
      container: minimapContainer,
      width: 200,
      height: 120,
      padding: 8,
      minScale: 0.1,
      maxScale: 0.2,
      scalable: true,
      graphOptions: {
        async: true,
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connector: 'smooth',
          connectionPoint: 'boundary'
        }
      }
    })
    graph.use(minimap)
  }
}
