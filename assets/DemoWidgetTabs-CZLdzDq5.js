import{D as o,W as s}from"./DemoWidgetTabs-DTNjmXKz.js";import{d as f,o as m,e as b,R as t,S as i,b as d,i as a,F as x,u as l,k as n,X as v}from"./index-CG-esnr9.js";import{A as y}from"./ApiTable-Sq3anAee.js";import{a as r}from"./demoCodeHighlight-CJZd7DvW.js";const T={class:"api-section"},g=`<div style="padding: 24px; text-align: center; color: #666">
  这是预览区域，放置组件实际效果
</div>`,W=`<WidgetTabs :code="sourceCode" :highlighted="highlighted">
  <div style="padding: 24px; text-align: center; color: #666">
    这是预览区域，放置组件实际效果
  </div>
</WidgetTabs>`,h=`<div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 120px;">
  全宽内容区
</div>`,C=`<WidgetTabs :code="sourceCode" :highlighted="highlighted" flush>
  <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 120px; display: flex; align-items: center; justify-content: center; color: #fff;">
    全宽内容区
  </div>
</WidgetTabs>`,_=f({__name:"DemoWidgetTabs",setup(k){const p=n(()=>r(g)),u=n(()=>r(h)),c={props:[{name:"code",type:"string",default:"—",required:!0,desc:"代码 Tab 展示的源代码文本"},{name:"highlighted",type:"string",default:"—",required:!0,desc:"经 highlight 处理后的代码 HTML"},{name:"flush",type:"boolean",default:"true",required:!1,desc:"预览区去除内边距"}]};return(D,e)=>(m(),b(x,null,[e[3]||(e[3]=t("div",{class:"doc-content__header"},[t("h2",null,"WidgetTabs"),t("p",null,"预览/代码切换容器，代码 Tab 内置 CodeBlock 提供复制功能。")],-1)),i(o,{code:W},{default:d(()=>[i(l(s),{code:g,highlighted:p.value},{default:d(()=>[...e[0]||(e[0]=[t("div",{style:{padding:"24px","text-align":"center",color:"#666"}}," 这是预览区域，放置组件实际效果 ",-1)])]),_:1},8,["highlighted"])]),_:1}),e[4]||(e[4]=t("h3",{style:{"margin-top":"32px"}},"贴边模式",-1)),e[5]||(e[5]=t("p",null,[a("设置 "),t("code",null,"flush"),a("，预览区去除内边距：")],-1)),i(o,{code:C},{default:d(()=>[i(l(s),{code:h,highlighted:u.value,flush:""},{default:d(()=>[...e[1]||(e[1]=[t("div",{style:{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",height:"120px",display:"flex","align-items":"center","justify-content":"center",color:"#fff","font-size":"18px"}}," 全宽内容区 ",-1)])]),_:1},8,["highlighted"])]),_:1}),t("div",T,[e[2]||(e[2]=t("h3",{class:"api-section__title"},"WidgetTabs Props",-1)),i(y,{type:"props",rows:c.props},null,8,["rows"])])],64))}}),N=v(_,[["__scopeId","data-v-03f31d03"]]);export{N as default};
