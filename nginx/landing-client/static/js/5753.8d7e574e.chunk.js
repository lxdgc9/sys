"use strict";(self.webpackChunkiit29062023=self.webpackChunkiit29062023||[]).push([[5753],{54406:function(e,t,n){n.d(t,{Z:function(){return x}});var r=n(1413),o=n(45987),a=n(64554),i=n(50533),l=n(36314),s=n(4567),c=n(93517),d=n(89302),u=n(80184);function h(e){var t=e.link,n=e.activeLast,o=e.disabled,l=t.name,s=t.href,c=t.icon,h=(0,r.Z)({typography:"body2",alignItems:"center",color:"text.primary",display:"inline-flex"},o&&!n&&{cursor:"default",pointerEvents:"none",color:"text.disabled"}),p=(0,u.jsxs)(u.Fragment,{children:[c&&(0,u.jsx)(a.Z,{component:"span",sx:{mr:1,display:"inherit","& svg":{width:20,height:20}},children:c}),l]});return s?(0,u.jsx)(i.Z,{component:d.r,href:s,sx:h,children:p}):(0,u.jsxs)(a.Z,{sx:h,children:[" ",p," "]})}var p=["links","action","heading","moreLink","activeLast","sx"];function x(e){var t=e.links,n=e.action,d=e.heading,x=e.moreLink,g=e.activeLast,f=e.sx,Z=(0,o.Z)(e,p),b=t[t.length-1].name;return(0,u.jsxs)(a.Z,{sx:(0,r.Z)({},f),children:[(0,u.jsxs)(l.Z,{direction:"row",alignItems:"center",children:[(0,u.jsxs)(a.Z,{sx:{flexGrow:1},children:[d&&(0,u.jsx)(s.Z,{variant:"h4",gutterBottom:!0,children:d}),!!t.length&&(0,u.jsx)(c.Z,(0,r.Z)((0,r.Z)({separator:(0,u.jsx)(m,{})},Z),{},{children:t.map((function(e){return(0,u.jsx)(h,{link:e,activeLast:g,disabled:e.name===b},e.name||"")}))}))]}),n&&(0,u.jsxs)(a.Z,{sx:{flexShrink:0},children:[" ",n," "]})]}),!!x&&(0,u.jsx)(a.Z,{sx:{mt:2},children:x.map((function(e){return(0,u.jsx)(i.Z,{href:e,variant:"body2",target:"_blank",rel:"noopener",sx:{display:"table"},children:e},e)}))})]})}function m(){return(0,u.jsx)(a.Z,{component:"span",sx:{width:4,height:4,borderRadius:"50%",bgcolor:"text.disabled"}})}},25753:function(e,t,n){n.r(t),n.d(t,{default:function(){return T}});var r=n(6907),o=n(4942),a=n(1413),i=n(29439),l=n(18111),s=n.n(l),c=n(72791),d=n(12065),u=n(64554),h=n(1503),p=n(27938),x=n(36314),m=n(27029),g=n(25256),f=n(89891),Z=n(34663),b=n(17133),v=n(89164),j=n(48550),C=n(13400),y=n(4567),w=n(88970),S=n(25801),k=n(7055),R=n(61005),L=n(23329),P=n(45519),I=n(54406),N=n(80184),B={itemGap:4,iconSize:24,currentRole:"admin",itemRootHeight:44,itemSubHeight:36,itemPadding:"4px 8px 4px 12px",itemRadius:8,hiddenLabel:!1};function z(){var e=(0,c.useState)(B),t=(0,i.Z)(e,2),n=t[0],r=t[1],l=!s()(B,n),h=(0,c.useCallback)((function(e,t){r((function(n){return(0,a.Z)((0,a.Z)({},n),{},(0,o.Z)({},e,t))}))}),[]),p=(0,c.useCallback)((function(){r(B)}),[]),m=(0,N.jsxs)(x.Z,{spacing:2,children:[(0,N.jsx)(y.Z,{variant:"h6",children:" Nav Vertical "}),(0,N.jsx)(P.Mr,{data:M,config:n,sx:{py:2,borderRadius:2,bgcolor:"background.paper",boxShadow:function(e){return e.customShadows.z20}}})]}),f=(0,N.jsxs)(x.Z,{spacing:2,children:[(0,N.jsx)(y.Z,{variant:"h6",children:" Nav Mini "}),(0,N.jsx)(P.Hg,{data:M,config:n,sx:{py:2,borderRadius:2,bgcolor:"background.paper",boxShadow:function(e){return e.customShadows.z20}}})]}),b=(0,N.jsxs)(x.Z,{spacing:2,children:[(0,N.jsx)(y.Z,{variant:"h6",children:" Nav Horizontal "}),(0,N.jsx)(g.Z,{position:"static",component:"nav",sx:{borderRadius:2,boxShadow:function(e){return e.customShadows.z20}},children:(0,N.jsx)(Z.Z,{children:(0,N.jsx)(P.EM,{data:M,config:n})})})]});return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(u.Z,{sx:{py:5,bgcolor:function(e){return"light"===e.palette.mode?"grey.200":"grey.800"}},children:(0,N.jsx)(v.Z,{children:(0,N.jsx)(I.Z,{heading:"Navigation Bar",links:[{name:"Components",href:k.H.components},{name:"Navigation Bar"}]})})}),(0,N.jsxs)(v.Z,{sx:{my:10},children:[b,(0,N.jsxs)(x.Z,{direction:"row",justifyContent:"space-between",sx:{p:5,mt:5,borderRadius:2,bgcolor:function(e){return(0,d.Fq)(e.palette.grey[500],.04)}},children:[m,f,(0,N.jsx)(H,{config:n,onChangeConfig:h,canReset:l,onReset:p})]})]})]})}function H(e){var t=e.config,n=e.onChangeConfig,r=e.canReset,o=e.onReset;return(0,N.jsxs)(x.Z,{component:p.Z,variant:"outlined",spacing:3,sx:{p:3,borderRadius:2},children:[(0,N.jsxs)(x.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",children:[(0,N.jsx)(y.Z,{variant:"h6",children:"Controls"}),r&&(0,N.jsx)(C.Z,{onClick:o,children:(0,N.jsx)(m.Z,{color:"error",variant:"dot",invisible:!r,children:(0,N.jsx)(R.Z,{icon:"solar:restart-bold"})})})]}),(0,N.jsx)(j.Z,{label:"Item Gap",type:"number",value:t.itemGap||"",onChange:function(e){return n("itemGap",Number(e.target.value))}}),(0,N.jsx)(j.Z,{select:!0,label:"Icon Size",value:t.iconSize,onChange:function(e){return n("iconSize",Number(e.target.value))},SelectProps:{native:!0},children:[16,20,24,28,32,36,40].map((function(e){return(0,N.jsx)("option",{value:e,children:e},e)}))}),(0,N.jsx)(j.Z,{select:!0,label:"Item Radius",value:t.itemRadius,onChange:function(e){return n("itemRadius",Number(e.target.value)||.5)},SelectProps:{native:!0},children:[0,4,8,12,16,20,24].map((function(e){return(0,N.jsx)("option",{value:e,children:e},e)}))}),(0,N.jsxs)(w.Z,{value:t.currentRole,onChange:function(e){return n("currentRole",e.target.value)},children:[(0,N.jsx)(b.Z,{children:"Role"}),["admin","user"].map((function(e){return(0,N.jsx)(S.Z,{value:e,control:(0,N.jsx)(h.Z,{}),label:e,sx:{textTransform:"capitalize"}},e)}))]}),(0,N.jsx)(j.Z,{label:"Root Height",type:"number",value:t.itemRootHeight||"",onChange:function(e){return n("itemRootHeight",Number(e.target.value))}}),(0,N.jsx)(j.Z,{label:"Sub Height",type:"number",value:t.itemSubHeight||"",onChange:function(e){return n("itemSubHeight",Number(e.target.value))}}),(0,N.jsx)(j.Z,{label:"Item Padding",value:t.itemPadding||"",onChange:function(e){return n("itemPadding",e.target.value)}}),(0,N.jsx)(S.Z,{control:(0,N.jsx)(f.Z,{checked:t.hiddenLabel,onClick:function(){return n("hiddenLabel",!t.hiddenLabel)}}),label:"Hidden Label"})]})}var M=[{subheader:"Marketing",items:[{title:"Landing",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:bat",width:1}),roles:["admin"],caption:"Display only admin role"},{title:"Services",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:cyclist",width:1}),roles:["admin","user"]},{title:"Case Studies",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:3d-cursor-alt",width:1}),info:(0,N.jsx)(L.Z,{color:"error",children:"+32"}),children:[{title:"Case Studies",path:"#"},{title:"Case Study",path:"#"}]},{title:"Blog",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:3d-mpr-toggle",width:1}),children:[{title:"Blog Posts",path:"#"},{title:"Blog Post",path:"#"}]},{title:"About",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:airport-01",width:1})},{title:"Contact",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:battery-full",width:1})},{title:"Tours",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:basketball",width:1}),children:[{title:"Tours",path:"#"},{title:"Tour",path:"#"}]},{title:"Checkout",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:area",width:1}),children:[{title:"Checkout",path:"#"},{title:"Checkout Complete",path:"#"}]}]},{subheader:"Travel",items:[{title:"Level 1",path:"#",icon:(0,N.jsx)(R.Z,{icon:"carbon:play",width:1}),children:[{title:"Level 2.1",path:"#"},{title:"Level 2.2",path:"#"},{title:"Level 2.3",path:"#",children:[{title:"Level 3.1",path:"#"},{title:"Level 3.2",path:"#"}]}]}]}];function T(){return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(r.ql,{children:(0,N.jsx)("title",{children:" Extra: Navigation Bar"})}),(0,N.jsx)(z,{})]})}},93517:function(e,t,n){n.d(t,{Z:function(){return z}});var r=n(93433),o=n(29439),a=n(4942),i=n(87462),l=n(63366),s=n(72791),c=(n(57441),n(28182)),d=n(94419),u=n(57271),h=n(66934),p=n(31402),x=n(4567),m=n(12065),g=n(74223),f=n(80184),Z=(0,g.Z)((0,f.jsx)("path",{d:"M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"}),"MoreHoriz"),b=n(95080),v=["slots","slotProps"],j=(0,h.ZP)(b.Z)((function(e){var t=e.theme;return(0,i.Z)({display:"flex",marginLeft:"calc(".concat(t.spacing(1)," * 0.5)"),marginRight:"calc(".concat(t.spacing(1)," * 0.5)")},"light"===t.palette.mode?{backgroundColor:t.palette.grey[100],color:t.palette.grey[700]}:{backgroundColor:t.palette.grey[700],color:t.palette.grey[100]},{borderRadius:2,"&:hover, &:focus":(0,i.Z)({},"light"===t.palette.mode?{backgroundColor:t.palette.grey[200]}:{backgroundColor:t.palette.grey[600]}),"&:active":(0,i.Z)({boxShadow:t.shadows[0]},"light"===t.palette.mode?{backgroundColor:(0,m._4)(t.palette.grey[200],.12)}:{backgroundColor:(0,m._4)(t.palette.grey[600],.12)})})})),C=(0,h.ZP)(Z)({width:24,height:16});var y=function(e){var t=e.slots,n=void 0===t?{}:t,r=e.slotProps,o=void 0===r?{}:r,a=(0,l.Z)(e,v),s=e;return(0,f.jsx)("li",{children:(0,f.jsx)(j,(0,i.Z)({focusRipple:!0},a,{ownerState:s,children:(0,f.jsx)(C,(0,i.Z)({as:n.CollapsedIcon,ownerState:s},o.collapsedIcon))}))})},w=n(75878),S=n(21217);function k(e){return(0,S.Z)("MuiBreadcrumbs",e)}var R=(0,w.Z)("MuiBreadcrumbs",["root","ol","li","separator"]),L=["children","className","component","slots","slotProps","expandText","itemsAfterCollapse","itemsBeforeCollapse","maxItems","separator"],P=(0,h.ZP)(x.Z,{name:"MuiBreadcrumbs",slot:"Root",overridesResolver:function(e,t){return[(0,a.Z)({},"& .".concat(R.li),t.li),t.root]}})({}),I=(0,h.ZP)("ol",{name:"MuiBreadcrumbs",slot:"Ol",overridesResolver:function(e,t){return t.ol}})({display:"flex",flexWrap:"wrap",alignItems:"center",padding:0,margin:0,listStyle:"none"}),N=(0,h.ZP)("li",{name:"MuiBreadcrumbs",slot:"Separator",overridesResolver:function(e,t){return t.separator}})({display:"flex",userSelect:"none",marginLeft:8,marginRight:8});function B(e,t,n,r){return e.reduce((function(o,a,i){return i<e.length-1?o=o.concat(a,(0,f.jsx)(N,{"aria-hidden":!0,className:t,ownerState:r,children:n},"separator-".concat(i))):o.push(a),o}),[])}var z=s.forwardRef((function(e,t){var n=(0,p.Z)({props:e,name:"MuiBreadcrumbs"}),a=n.children,h=n.className,x=n.component,m=void 0===x?"nav":x,g=n.slots,Z=void 0===g?{}:g,b=n.slotProps,v=void 0===b?{}:b,j=n.expandText,C=void 0===j?"Show path":j,w=n.itemsAfterCollapse,S=void 0===w?1:w,R=n.itemsBeforeCollapse,N=void 0===R?1:R,z=n.maxItems,H=void 0===z?8:z,M=n.separator,T=void 0===M?"/":M,A=(0,l.Z)(n,L),G=s.useState(!1),E=(0,o.Z)(G,2),F=E[0],q=E[1],_=(0,i.Z)({},n,{component:m,expanded:F,expandText:C,itemsAfterCollapse:S,itemsBeforeCollapse:N,maxItems:H,separator:T}),V=function(e){var t=e.classes;return(0,d.Z)({root:["root"],li:["li"],ol:["ol"],separator:["separator"]},k,t)}(_),D=(0,u.Z)({elementType:Z.CollapsedIcon,externalSlotProps:v.collapsedIcon,ownerState:_}),O=s.useRef(null),W=s.Children.toArray(a).filter((function(e){return s.isValidElement(e)})).map((function(e,t){return(0,f.jsx)("li",{className:V.li,children:e},"child-".concat(t))}));return(0,f.jsx)(P,(0,i.Z)({ref:t,component:m,color:"text.secondary",className:(0,c.Z)(V.root,h),ownerState:_},A,{children:(0,f.jsx)(I,{className:V.ol,ref:O,ownerState:_,children:B(F||H&&W.length<=H?W:function(e){return N+S>=e.length?e:[].concat((0,r.Z)(e.slice(0,N)),[(0,f.jsx)(y,{"aria-label":C,slots:{CollapsedIcon:Z.CollapsedIcon},slotProps:{collapsedIcon:D},onClick:function(){q(!0);var e=O.current.querySelector("a[href],button,[tabindex]");e&&e.focus()}},"ellipsis")],(0,r.Z)(e.slice(e.length-S,e.length)))}(W),V.separator,T,_)})}))}))}}]);
//# sourceMappingURL=5753.8d7e574e.chunk.js.map