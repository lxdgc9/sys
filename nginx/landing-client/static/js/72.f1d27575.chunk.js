"use strict";(self.webpackChunkiit29062023=self.webpackChunkiit29062023||[]).push([[72],{54406:function(e,n,t){t.d(n,{Z:function(){return m}});var i=t(1413),r=t(45987),o=t(64554),s=t(50533),l=t(36314),a=t(4567),c=t(93517),d=t(89302),u=t(80184);function h(e){var n=e.link,t=e.activeLast,r=e.disabled,l=n.name,a=n.href,c=n.icon,h=(0,i.Z)({typography:"body2",alignItems:"center",color:"text.primary",display:"inline-flex"},r&&!t&&{cursor:"default",pointerEvents:"none",color:"text.disabled"}),x=(0,u.jsxs)(u.Fragment,{children:[c&&(0,u.jsx)(o.Z,{component:"span",sx:{mr:1,display:"inherit","& svg":{width:20,height:20}},children:c}),l]});return a?(0,u.jsx)(s.Z,{component:d.r,href:a,sx:h,children:x}):(0,u.jsxs)(o.Z,{sx:h,children:[" ",x," "]})}var x=["links","action","heading","moreLink","activeLast","sx"];function m(e){var n=e.links,t=e.action,d=e.heading,m=e.moreLink,Z=e.activeLast,p=e.sx,j=(0,r.Z)(e,x),g=n[n.length-1].name;return(0,u.jsxs)(o.Z,{sx:(0,i.Z)({},p),children:[(0,u.jsxs)(l.Z,{direction:"row",alignItems:"center",children:[(0,u.jsxs)(o.Z,{sx:{flexGrow:1},children:[d&&(0,u.jsx)(a.Z,{variant:"h4",gutterBottom:!0,children:d}),!!n.length&&(0,u.jsx)(c.Z,(0,i.Z)((0,i.Z)({separator:(0,u.jsx)(f,{})},j),{},{children:n.map((function(e){return(0,u.jsx)(h,{link:e,activeLast:Z,disabled:e.name===g},e.name||"")}))}))]}),t&&(0,u.jsxs)(o.Z,{sx:{flexShrink:0},children:[" ",t," "]})]}),!!m&&(0,u.jsx)(o.Z,{sx:{mt:2},children:m.map((function(e){return(0,u.jsx)(s.Z,{href:e,variant:"body2",target:"_blank",rel:"noopener",sx:{display:"table"},children:e},e)}))})]})}function f(){return(0,u.jsx)(o.Z,{component:"span",sx:{width:4,height:4,borderRadius:"50%",bgcolor:"text.disabled"}})}},58816:function(e,n,t){t.r(n),t.d(n,{default:function(){return P}});var i=t(6907),r=t(16002),o=t(36562),s=t(35651),l=t(23454),a=t(27454),c=t(28666),d=t(65552),u=t(63366),h=t(87462),x=t(72791),m=t(28182),f=t(66934),Z=t(31402),p=t(14036),j=t(94419),g=t(4567),v=t(91063),y=t(56783),b=t(80184),k=["className"],w=(0,f.ZP)(g.Z,{name:"MuiTimelineOppositeContent",slot:"Root",overridesResolver:function(e,n){var t=e.ownerState;return[n.root,n["position".concat((0,p.Z)(t.position))]]}})((function(e){var n=e.ownerState;return(0,h.Z)({padding:"6px 16px",marginRight:"auto",textAlign:"right",flex:1},"left"===n.position&&{textAlign:"left"})})),N=x.forwardRef((function(e,n){var t=(0,Z.Z)({props:e,name:"MuiTimelineOppositeContent"}),i=t.className,r=(0,u.Z)(t,k),o=x.useContext(v.Z).position,s=(0,h.Z)({},t,{position:o||"left"}),l=function(e){var n=e.position,t=e.classes,i={root:["root","position".concat((0,p.Z)(n))]};return(0,j.Z)(i,y.W,t)}(s);return(0,b.jsx)(w,(0,h.Z)({component:"div",className:(0,m.Z)(l.root,i),ownerState:s,ref:n},r))}));N.muiName="TimelineOppositeContent";var M=N,C=t(12065),S=t(64554),R=t(27938),H=t(89164),F=t(7055),O=t(61005),E=t(54406),L=t(24244),T=[{key:1,title:"Default",des:"Morbi mattis ullamcorper",time:"09:30 am",icon:(0,b.jsx)(O.Z,{icon:"eva:folder-add-fill",width:24})},{key:2,title:"Primary",des:"Morbi mattis ullamcorper",time:"10:00 am",color:"primary",icon:(0,b.jsx)(O.Z,{icon:"eva:image-2-fill",width:24})},{key:3,title:"Secondary",des:"Morbi mattis ullamcorper",time:"10:00 am",color:"secondary",icon:(0,b.jsx)(O.Z,{icon:"eva:pantone-fill",width:24})},{key:4,title:"Info",des:"Morbi mattis ullamcorper",time:"10:30 am",color:"info",icon:(0,b.jsx)(O.Z,{icon:"eva:tv-fill",width:24})},{key:5,title:"Success",des:"Morbi mattis ullamcorper",time:"11:00 am",color:"success",icon:(0,b.jsx)(O.Z,{icon:"eva:activity-fill",width:24})},{key:6,title:"Warning",des:"Morbi mattis ullamcorper",time:"11:30 am",color:"warning",icon:(0,b.jsx)(O.Z,{icon:"eva:cube-fill",width:24})},{key:7,title:"Error",des:"Morbi mattis ullamcorper",time:"12:00 am",color:"error",icon:(0,b.jsx)(O.Z,{icon:"eva:film-fill",width:24})}];function A(){var e=T[T.length-1].key,n=T.slice(T.length-3);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(S.Z,{sx:{py:5,bgcolor:function(e){return"light"===e.palette.mode?"grey.200":"grey.800"}},children:(0,b.jsx)(H.Z,{children:(0,b.jsx)(E.Z,{heading:"Timeline",links:[{name:"Components",href:F.H.components},{name:"Timeline"}],moreLink:["https://mui.com/components/timeline"]})})}),(0,b.jsxs)(H.Z,{sx:{my:10},children:[(0,b.jsxs)(r.ZP,{columns:{xs:1,md:3},spacing:3,children:[(0,b.jsx)(L.Z,{title:"Default",children:(0,b.jsx)(o.Z,{children:n.map((function(n){return(0,b.jsxs)(l.Z,{children:[(0,b.jsxs)(c.Z,{children:[(0,b.jsx)(s.Z,{}),e===n.key?null:(0,b.jsx)(d.Z,{})]}),(0,b.jsx)(a.Z,{children:n.title})]},n.key)}))})}),(0,b.jsx)(L.Z,{title:"Right",children:(0,b.jsx)(o.Z,{position:"right",children:n.map((function(n){return(0,b.jsxs)(l.Z,{children:[(0,b.jsxs)(c.Z,{children:[(0,b.jsx)(s.Z,{}),e===n.key?null:(0,b.jsx)(d.Z,{})]}),(0,b.jsx)(a.Z,{children:n.title})]},n.key)}))})}),(0,b.jsx)(L.Z,{title:"Alternating",children:(0,b.jsx)(o.Z,{position:"alternate",children:n.map((function(n){return(0,b.jsxs)(l.Z,{children:[(0,b.jsxs)(c.Z,{children:[(0,b.jsx)(s.Z,{}),e===n.key?null:(0,b.jsx)(d.Z,{})]}),(0,b.jsx)(a.Z,{children:n.title})]},n.key)}))})}),(0,b.jsx)(L.Z,{title:"Filled",children:(0,b.jsx)(o.Z,{position:"alternate",children:T.map((function(n){return(0,b.jsxs)(l.Z,{children:[(0,b.jsxs)(c.Z,{children:[(0,b.jsx)(s.Z,{color:n.color}),e===n.key?null:(0,b.jsx)(d.Z,{})]}),(0,b.jsx)(a.Z,{children:n.title})]},n.key)}))})}),(0,b.jsx)(L.Z,{title:"Outlined",children:(0,b.jsx)(o.Z,{position:"alternate",children:T.map((function(n){return(0,b.jsxs)(l.Z,{children:[(0,b.jsxs)(c.Z,{children:[(0,b.jsx)(s.Z,{variant:"outlined",color:n.color}),e===n.key?null:(0,b.jsx)(d.Z,{})]}),(0,b.jsx)(a.Z,{children:n.title})]},n.key)}))})}),(0,b.jsx)(L.Z,{title:"Opposite content",children:(0,b.jsx)(o.Z,{position:"alternate",children:T.map((function(n){return(0,b.jsxs)(l.Z,{children:[(0,b.jsx)(M,{children:(0,b.jsx)(g.Z,{sx:{color:"text.secondary"},children:n.time})}),(0,b.jsxs)(c.Z,{children:[(0,b.jsx)(s.Z,{color:n.color}),e===n.key?null:(0,b.jsx)(d.Z,{})]}),(0,b.jsx)(a.Z,{children:(0,b.jsxs)(g.Z,{children:[" ",n.title]})})]},n.key)}))})})]}),(0,b.jsx)(L.Z,{title:"Customized",children:(0,b.jsx)(o.Z,{position:"alternate",children:T.map((function(e){return(0,b.jsxs)(l.Z,{children:[(0,b.jsx)(M,{children:(0,b.jsx)(g.Z,{variant:"body2",sx:{color:"text.secondary"},children:e.time})}),(0,b.jsxs)(c.Z,{children:[(0,b.jsx)(s.Z,{color:e.color,children:e.icon}),(0,b.jsx)(d.Z,{})]}),(0,b.jsx)(a.Z,{children:(0,b.jsxs)(R.Z,{sx:{p:3,bgcolor:function(e){return(0,C.Fq)(e.palette.grey[500],.12)}},children:[(0,b.jsx)(g.Z,{variant:"subtitle2",children:e.title}),(0,b.jsx)(g.Z,{variant:"body2",sx:{color:"text.secondary"},children:e.des})]})})]},e.key)}))})})]})]})}function P(){return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i.ql,{children:(0,b.jsx)("title",{children:" MUI: Timeline"})}),(0,b.jsx)(A,{})]})}},24244:function(e,n,t){t.d(n,{Z:function(){return u}});var i=t(1413),r=t(45987),o=t(12065),s=t(27938),l=t(9585),a=t(36314),c=t(80184),d=["title","sx","children"];function u(e){var n=e.title,t=e.sx,u=e.children,h=(0,r.Z)(e,d);return(0,c.jsxs)(s.Z,{variant:"outlined",sx:{borderRadius:1.5,borderStyle:"dashed",bgcolor:function(e){return(0,o.Fq)(e.palette.grey[500],.04)}},children:[n&&(0,c.jsx)(l.Z,{title:n}),(0,c.jsx)(a.Z,(0,i.Z)((0,i.Z)({spacing:3,direction:"row",alignItems:"center",justifyContent:"center",flexWrap:"wrap",sx:(0,i.Z)({p:5,minHeight:180},t)},h),{},{children:u}))]})}},16002:function(e,n,t){t.d(n,{ZP:function(){return w}});var i=t(93433),r=t(29439),o=t(63366),s=t(87462),l=t(94419),a=t(54164),c=t(66934),d=t(31402),u=t(51184),h=t(45682),x=t(82466),m=t(47563),f=t(28182),Z=t(72791),p=t(21217);function j(e){return(0,p.Z)("MuiMasonry",e)}(0,t(75878).Z)("MuiMasonry",["root"]);var g=t(80184),v=["children","className","component","columns","spacing","defaultColumns","defaultHeight","defaultSpacing"],y=function(e){return Number(e.replace("px",""))},b={flexBasis:"100%",width:0,margin:0,padding:0},k=(0,c.ZP)("div",{name:"MuiMasonry",slot:"Root",overridesResolver:function(e,n){return[n.root]}})((function(e){var n=e.ownerState,t=e.theme,i={width:"100%",display:"flex",flexFlow:"column wrap",alignContent:"flex-start",boxSizing:"border-box","& > *":{boxSizing:"border-box"}},r={};if(n.isSSR){for(var o={},l=y(t.spacing(n.defaultSpacing)),a=1;a<=n.defaultColumns;a+=1)o["&:nth-of-type(".concat(n.defaultColumns,"n+").concat(a%n.defaultColumns,")")]={order:a};return r.height=n.defaultHeight,r.margin=-l/2,r["& > *"]=(0,s.Z)({},i["& > *"],o,{margin:l/2,width:"calc(".concat((100/n.defaultColumns).toFixed(2),"% - ").concat(l,"px)")}),(0,s.Z)({},i,r)}var c=(0,u.P$)({values:n.spacing,breakpoints:t.breakpoints.values}),d=(0,h.hB)(t);i=(0,x.Z)(i,(0,u.k9)({theme:t},c,(function(e){var t;if("string"===typeof e&&!Number.isNaN(Number(e))||"number"===typeof e){var i=Number(e);t=(0,h.NA)(d,i)}else t=e;return(0,s.Z)({margin:"calc(0px - (".concat(t," / 2))"),"& > *":{margin:"calc(".concat(t," / 2)")}},n.maxColumnHeight&&{height:"number"===typeof t?Math.ceil(n.maxColumnHeight+y(t)):"calc(".concat(n.maxColumnHeight,"px + ").concat(t,")")})})));var m=(0,u.P$)({values:n.columns,breakpoints:t.breakpoints.values});return i=(0,x.Z)(i,(0,u.k9)({theme:t},m,(function(e){var n=Number(e),t="".concat((100/n).toFixed(2),"%"),i="string"===typeof c&&!Number.isNaN(Number(c))||"number"===typeof c?(0,h.NA)(d,Number(c)):"0px";return{"& > *":{width:"calc(".concat(t," - ").concat(i,")")}}}))),"object"===typeof c&&(i=(0,x.Z)(i,(0,u.k9)({theme:t},c,(function(e,n){if(n){var t=Number(e),i=Object.keys(m).pop(),r=(0,h.NA)(d,t),o="object"===typeof m?m[n]||m[i]:m,s="".concat((100/o).toFixed(2),"%");return{"& > *":{width:"calc(".concat(s," - ").concat(r,")")}}}return null})))),i})),w=Z.forwardRef((function(e,n){var t=(0,d.Z)({props:e,name:"MuiMasonry"}),c=t.children,u=t.className,h=t.component,x=void 0===h?"div":h,p=t.columns,w=void 0===p?4:p,N=t.spacing,M=void 0===N?1:N,C=t.defaultColumns,S=t.defaultHeight,R=t.defaultSpacing,H=(0,o.Z)(t,v),F=Z.useRef(),O=Z.useState(),E=(0,r.Z)(O,2),L=E[0],T=E[1],A=!L&&S&&void 0!==C&&void 0!==R,P=Z.useState(A?C-1:0),I=(0,r.Z)(P,2),z=I[0],W=I[1],B=(0,s.Z)({},t,{spacing:M,columns:w,maxColumnHeight:L,defaultColumns:C,defaultHeight:S,defaultSpacing:R,isSSR:A}),q=function(e){var n=e.classes;return(0,l.Z)({root:["root"]},j,n)}(B),D=Z.useRef("undefined"===typeof ResizeObserver?void 0:new ResizeObserver((function(e){if(F.current&&e&&0!==e.length){var n=F.current,t=F.current.firstChild,r=n.clientWidth,o=t.clientWidth;if(0!==r&&0!==o){var s=window.getComputedStyle(t),l=y(s.marginLeft),c=y(s.marginRight),d=Math.round(r/(o+l+c)),u=new Array(d).fill(0),h=!1;n.childNodes.forEach((function(e){if(e.nodeType===Node.ELEMENT_NODE&&"line-break"!==e.dataset.class&&!h){var n=window.getComputedStyle(e),t=y(n.marginTop),r=y(n.marginBottom),o=y(n.height)?Math.ceil(y(n.height))+t+r:0;if(0!==o){for(var s=0;s<e.childNodes.length;s+=1){var l=e.childNodes[s];if("IMG"===l.tagName&&0===l.clientHeight){h=!0;break}}if(!h){var a=u.indexOf(Math.min.apply(Math,(0,i.Z)(u)));u[a]+=o;var c=a+1;e.style.order=c}}else h=!0}})),h||a.flushSync((function(){T(Math.max.apply(Math,(0,i.Z)(u))),W(d>0?d-1:0)}))}}})));Z.useEffect((function(){var e=D.current;if(void 0!==e)return F.current&&F.current.childNodes.forEach((function(n){e.observe(n)})),function(){return e?e.disconnect():{}}}),[w,M,c]);var G=(0,m.Z)(n,F),$=new Array(z).fill("").map((function(e,n){return(0,g.jsx)("span",{"data-class":"line-break",style:(0,s.Z)({},b,{order:n+1})},n)}));return(0,g.jsxs)(k,(0,s.Z)({as:x,className:(0,f.Z)(q.root,u),ref:G,ownerState:B},H,{children:[c,$]}))}))},13701:function(e,n,t){var i=t(78);n.Z=i.Z}}]);
//# sourceMappingURL=72.f1d27575.chunk.js.map