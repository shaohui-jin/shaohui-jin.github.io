import { SidebarObjectOptions } from '../interface';

export const tipsSidebar: SidebarObjectOptions = {
  '/Tips/': [
    'UseWorker/',
    'UseObserver/',

    'UseFragmentDownload/',
    'UseIdelLoad/',

    'WebApi/',

    'Vue/UseTheme/',
    'Vue/UseAsyncLoad/',
    'Vue/UseContextLoad/',
    'Vue/UseChildLife/',
    'Vue/UsePersist/',
    {
      text: 'CSS',
      // icon: 'iconfont icon-css',
      activeMatch: '/CSS/(.*)$',
      // collapsible: true,
      children: [
        { text: '表单相关', link: 'CSS/Form/' },
        { text: '文本排版相关', link: 'CSS/TextLayout/' },
        { text: '布局排版相关', link: 'CSS/Layout/' },
        { text: 'Canvas相关', link: 'CSS/Canvas/' },
        { text: '过渡动画相关', link: 'CSS/Transition/' }
      ]
    },
    {
      text: 'JavaScript',
      // icon: 'iconfont icon-javascript',
      activeMatch: '/JavaScript/(.*)$',
      // collapsible: true,
      children: [
        { text: '小技巧', link: 'JavaScript/' },
        { text: '数据操作相关', link: 'JavaScript/Data/' },
        { text: '设计模式相关', link: 'JavaScript/DesignPattern/' },
      ]
    },
  ],
};
