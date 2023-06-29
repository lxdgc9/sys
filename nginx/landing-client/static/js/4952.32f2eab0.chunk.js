"use strict";(self.webpackChunkiit29062023=self.webpackChunkiit29062023||[]).push([[4952],{54406:function(e,n,t){t.d(n,{Z:function(){return p}});var r=t(1413),s=t(45987),o=t(64554),i=t(50533),l=t(36314),a=t(4567),c=t(93517),d=t(89302),x=t(80184);function u(e){var n=e.link,t=e.activeLast,s=e.disabled,l=n.name,a=n.href,c=n.icon,u=(0,r.Z)({typography:"body2",alignItems:"center",color:"text.primary",display:"inline-flex"},s&&!t&&{cursor:"default",pointerEvents:"none",color:"text.disabled"}),h=(0,x.jsxs)(x.Fragment,{children:[c&&(0,x.jsx)(o.Z,{component:"span",sx:{mr:1,display:"inherit","& svg":{width:20,height:20}},children:c}),l]});return a?(0,x.jsx)(i.Z,{component:d.r,href:a,sx:u,children:h}):(0,x.jsxs)(o.Z,{sx:u,children:[" ",h," "]})}var h=["links","action","heading","moreLink","activeLast","sx"];function p(e){var n=e.links,t=e.action,d=e.heading,p=e.moreLink,g=e.activeLast,j=e.sx,m=(0,s.Z)(e,h),f=n[n.length-1].name;return(0,x.jsxs)(o.Z,{sx:(0,r.Z)({},j),children:[(0,x.jsxs)(l.Z,{direction:"row",alignItems:"center",children:[(0,x.jsxs)(o.Z,{sx:{flexGrow:1},children:[d&&(0,x.jsx)(a.Z,{variant:"h4",gutterBottom:!0,children:d}),!!n.length&&(0,x.jsx)(c.Z,(0,r.Z)((0,r.Z)({separator:(0,x.jsx)(Z,{})},m),{},{children:n.map((function(e){return(0,x.jsx)(u,{link:e,activeLast:g,disabled:e.name===f},e.name||"")}))}))]}),t&&(0,x.jsxs)(o.Z,{sx:{flexShrink:0},children:[" ",t," "]})]}),!!p&&(0,x.jsx)(o.Z,{sx:{mt:2},children:p.map((function(e){return(0,x.jsx)(i.Z,{href:e,variant:"body2",target:"_blank",rel:"noopener",sx:{display:"table"},children:e},e)}))})]})}function Z(){return(0,x.jsx)(o.Z,{component:"span",sx:{width:4,height:4,borderRadius:"50%",bgcolor:"text.disabled"}})}},7017:function(e,n,t){t.d(n,{ZP:function(){return C},l2:function(){return l},wE:function(){return d}});var r=t(82599),s=t(54690),o=t(85375),i=t(84791);function l(e,n){var t=(new Date).getFullYear(),l=e?(0,r.Z)(e):null,a=n?(0,r.Z)(n):null,c=t===l&&t===a,d=!(!e||!n)&&(0,s.Z)(new Date(e),new Date(n)),x=!(!e||!n)&&(0,o.Z)(new Date(e),new Date(n));return c?x?d?(0,i.Mu)(n,"dd MMM yy"):"".concat((0,i.Mu)(e,"dd")," - ").concat((0,i.Mu)(n,"dd MMM yy")):"".concat((0,i.Mu)(e,"dd MMM")," - ").concat((0,i.Mu)(n,"dd MMM yy")):"".concat((0,i.Mu)(e,"dd MMM yy")," - ").concat((0,i.Mu)(n,"dd MMM yy"))}var a=t(29439),c=t(72791);function d(e,n){var t=(0,c.useState)(!1),r=(0,a.Z)(t,2),s=r[0],o=r[1],d=(0,c.useState)(n),x=(0,a.Z)(d,2),u=x[0],h=x[1],p=(0,c.useState)(e),Z=(0,a.Z)(p,2),g=Z[0],j=Z[1],m=!(!e||!n)&&new Date(e).getTime()>new Date(n).getTime(),f=(0,c.useCallback)((function(){o(!0)}),[]),b=(0,c.useCallback)((function(){o(!1)}),[]);return{startDate:g,endDate:u,onChangeStartDate:(0,c.useCallback)((function(e){j(e)}),[]),onChangeEndDate:(0,c.useCallback)((function(e){m&&h(null),h(e)}),[m]),open:s,onOpen:f,onClose:b,onReset:(0,c.useCallback)((function(){j(null),h(null)}),[]),selected:!!g&&!!u,error:m,label:"".concat((0,i.Mu)(g)," - ").concat((0,i.Mu)(u)),shortLabel:l(g,u),setStartDate:j,setEndDate:h}}var x=t(1413),u=t(53106),h=t(58331),p=t(27938),Z=t(36314),g=t(5849),j=t(5574),m=t(65661),f=t(97123),b=t(39157),y=t(47071),w=t(68051),v=t(80184);function C(e){var n=e.title,t=void 0===n?"Select date range":n,r=e.variant,s=void 0===r?"input":r,o=e.startDate,i=e.endDate,l=e.onChangeStartDate,a=e.onChangeEndDate,c=e.open,d=e.onClose,C=e.error,k=(0,w.F)("up","md"),S="calendar"===s;return(0,v.jsxs)(j.Z,{fullWidth:!0,maxWidth:!S&&"xs",open:c,onClose:d,PaperProps:{sx:(0,x.Z)({},S&&{maxWidth:720})},children:[(0,v.jsx)(m.Z,{sx:{pb:2},children:t}),(0,v.jsxs)(b.Z,{sx:(0,x.Z)({},S&&k&&{overflow:"unset"}),children:[(0,v.jsx)(Z.Z,{justifyContent:"center",spacing:S?3:2,direction:S&&k?"row":"column",sx:{pt:1},children:S?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(p.Z,{variant:"outlined",sx:{borderRadius:2,borderColor:"divider",borderStyle:"dashed"},children:(0,v.jsx)(h.W,{value:o,onChange:l})}),(0,v.jsx)(p.Z,{variant:"outlined",sx:{borderRadius:2,borderColor:"divider",borderStyle:"dashed"},children:(0,v.jsx)(h.W,{value:i,onChange:a})})]}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(u.M,{label:"Start date",value:o,onChange:l}),(0,v.jsx)(u.M,{label:"End date",value:i,onChange:a})]})}),C&&(0,v.jsx)(y.Z,{error:!0,sx:{px:2},children:"End date must be later than start date"})]}),(0,v.jsxs)(f.Z,{children:[(0,v.jsx)(g.Z,{variant:"outlined",color:"inherit",onClick:d,children:"Cancel"}),(0,v.jsx)(g.Z,{disabled:C,variant:"contained",onClick:d,children:"Apply"})]})]})}},93288:function(e,n,t){t.d(n,{Q:function(){return u}});var r=t(1413),s=t(45987),o=t(5849),i=t(5574),l=t(65661),a=t(97123),c=t(39157),d=t(80184),x=["title","content","action","open","onClose"];function u(e){var n=e.title,t=e.content,u=e.action,h=e.open,p=e.onClose,Z=(0,s.Z)(e,x);return(0,d.jsxs)(i.Z,(0,r.Z)((0,r.Z)({fullWidth:!0,maxWidth:"xs",open:h,onClose:p},Z),{},{children:[(0,d.jsx)(l.Z,{sx:{pb:2},children:n}),t&&(0,d.jsxs)(c.Z,{sx:{typography:"body2"},children:[" ",t," "]}),(0,d.jsxs)(a.Z,{children:[u,(0,d.jsx)(o.Z,{variant:"outlined",color:"inherit",onClick:p,children:"Cancel"})]})]}))}},85506:function(e,n,t){t.d(n,{Z:function(){return x}});var r=t(1413),s=t(45987),o=t(12065),i=t(64554),l=t(4567),a=t(36314),c=t(80184),d=["title","imgUrl","action","filled","description","sx"];function x(e){var n=e.title,t=e.imgUrl,x=e.action,u=e.filled,h=e.description,p=e.sx,Z=(0,s.Z)(e,d);return(0,c.jsxs)(a.Z,(0,r.Z)((0,r.Z)({flexGrow:1,alignItems:"center",justifyContent:"center",sx:(0,r.Z)((0,r.Z)({px:3,height:1},u&&{borderRadius:2,bgcolor:function(e){return(0,o.Fq)(e.palette.grey[500],.04)},border:function(e){return"dashed 1px ".concat((0,o.Fq)(e.palette.grey[500],.08))}}),p)},Z),{},{children:[(0,c.jsx)(i.Z,{component:"img",alt:"empty content",src:t||"/assets/icons/empty/ic_content.svg",sx:{width:1,maxWidth:160}}),n&&(0,c.jsx)(l.Z,{variant:"h6",component:"span",sx:{mt:1,color:"text.disabled",textAlign:"center"},children:n}),h&&(0,c.jsx)(l.Z,{variant:"caption",sx:{mt:1,color:"text.disabled",textAlign:"center"},children:h}),x&&x]}))}},37976:function(e,n,t){function r(e,n,t){return e?Math.max(0,(1+e)*n-t):0}function s(e,n,t){return n[t]<e[t]?-1:n[t]>e[t]?1:0}function o(e,n){return"desc"===e?function(e,t){return s(e,t,n)}:function(e,t){return-s(e,t,n)}}t.d(n,{$W:function(){return b},K:function(){return S},et:function(){return Z},S_:function(){return T},Z4:function(){return I},hM:function(){return f},fQ:function(){return r},sQ:function(){return o},x6:function(){return c}});var i=t(93433),l=t(29439),a=t(72791);function c(e){var n=(0,a.useState)(!(null===e||void 0===e||!e.defaultDense)),t=(0,l.Z)(n,2),r=t[0],s=t[1],o=(0,a.useState)((null===e||void 0===e?void 0:e.defaultCurrentPage)||0),c=(0,l.Z)(o,2),d=c[0],x=c[1],u=(0,a.useState)((null===e||void 0===e?void 0:e.defaultOrderBy)||"name"),h=(0,l.Z)(u,2),p=h[0],Z=h[1],g=(0,a.useState)((null===e||void 0===e?void 0:e.defaultRowsPerPage)||5),j=(0,l.Z)(g,2),m=j[0],f=j[1],b=(0,a.useState)((null===e||void 0===e?void 0:e.defaultOrder)||"asc"),y=(0,l.Z)(b,2),w=y[0],v=y[1],C=(0,a.useState)((null===e||void 0===e?void 0:e.defaultSelected)||[]),k=(0,l.Z)(C,2),S=k[0],D=k[1],P=(0,a.useCallback)((function(e){""!==e&&(v(p===e&&"asc"===w?"desc":"asc"),Z(e))}),[w,p]),R=(0,a.useCallback)((function(e){var n=S.includes(e)?S.filter((function(n){return n!==e})):[].concat((0,i.Z)(S),[e]);D(n)}),[S]),I=(0,a.useCallback)((function(e){x(0),f(parseInt(e.target.value,10))}),[]),M=(0,a.useCallback)((function(e){s(e.target.checked)}),[]),A=(0,a.useCallback)((function(e,n){D(e?n:[])}),[]),F=(0,a.useCallback)((function(e,n){x(n)}),[]),O=(0,a.useCallback)((function(){x(0)}),[]),T=(0,a.useCallback)((function(e){D([]),d&&e<2&&x(d-1)}),[d]),W=(0,a.useCallback)((function(e){var n=e.totalRows,t=e.totalRowsInPage,r=e.totalRowsFiltered,s=S.length;if(D([]),d)if(s===t)x(d-1);else if(s===r)x(0);else if(s>t){var o=Math.ceil((n-s)/m)-1;x(o)}}),[d,m,S.length]);return{dense:r,order:w,page:d,orderBy:p,rowsPerPage:m,selected:S,onSelectRow:R,onSelectAllRows:A,onSort:P,onChangePage:F,onChangeDense:M,onResetPage:O,onChangeRowsPerPage:I,onUpdatePageDeleteRow:T,onUpdatePageDeleteRows:W,setPage:x,setDense:s,setOrder:v,setOrderBy:Z,setSelected:D,setRowsPerPage:f}}var d=t(1413),x=t(9195),u=t(68745),h=t(85506),p=t(80184);function Z(e){var n=e.notFound,t=e.sx;return(0,p.jsx)(x.Z,{children:n?(0,p.jsx)(u.Z,{colSpan:12,children:(0,p.jsx)(h.Z,{filled:!0,title:"No Data",sx:(0,d.Z)({py:10},t)})}):(0,p.jsx)(u.Z,{colSpan:12,sx:{p:0}})})}var g=t(36459),j=t(36314),m=t(47047);function f(e){var n=Object.assign({},((0,g.Z)(e),e));return(0,p.jsx)(x.Z,(0,d.Z)((0,d.Z)({},n),{},{children:(0,p.jsx)(u.Z,{colSpan:12,children:(0,p.jsxs)(j.Z,{spacing:3,direction:"row",alignItems:"center",children:[(0,p.jsx)(m.Z,{sx:{borderRadius:1.5,width:48,height:48,flexShrink:0}}),(0,p.jsx)(m.Z,{sx:{width:1,height:12}}),(0,p.jsx)(m.Z,{sx:{width:180,height:12}}),(0,p.jsx)(m.Z,{sx:{width:160,height:12}}),(0,p.jsx)(m.Z,{sx:{width:140,height:12}}),(0,p.jsx)(m.Z,{sx:{width:120,height:12}})]})})}))}function b(e){var n=e.emptyRows,t=e.height;return n?(0,p.jsx)(x.Z,{sx:(0,d.Z)({},t&&{height:t*n}),children:(0,p.jsx)(u.Z,{colSpan:9})}):null}var y=t(64554),w=t(13034),v=t(56890),C=t(80720),k={border:0,margin:-1,padding:0,width:"1px",height:"1px",overflow:"hidden",position:"absolute",whiteSpace:"nowrap",clip:"rect(0 0 0 0)"};function S(e){var n=e.order,t=e.orderBy,r=e.rowCount,s=void 0===r?0:r,o=e.headLabel,i=e.numSelected,l=void 0===i?0:i,a=e.onSort,c=e.onSelectAllRows,h=e.sx;return(0,p.jsx)(v.Z,{sx:h,children:(0,p.jsxs)(x.Z,{children:[c&&(0,p.jsx)(u.Z,{padding:"checkbox",children:(0,p.jsx)(w.Z,{indeterminate:!!l&&l<s,checked:!!s&&l===s,onChange:function(e){return c(e.target.checked)}})}),o.map((function(e){return(0,p.jsx)(u.Z,{align:e.align||"left",sortDirection:t===e.id&&n,sx:{width:e.width,minWidth:e.minWidth},children:a?(0,p.jsxs)(C.Z,{hideSortIcon:!0,active:t===e.id,direction:t===e.id?n:"asc",onClick:function(){return a(e.id)},children:[e.label,t===e.id?(0,p.jsx)(y.Z,{sx:(0,d.Z)({},k),children:"desc"===n?"sorted descending":"sorted ascending"}):null]}):e.label},e.id)}))]})})}var D=t(45987),P=t(4567),R=["dense","action","rowCount","numSelected","onSelectAllRows","sx"];function I(e){var n=e.dense,t=e.action,r=e.rowCount,s=e.numSelected,o=e.onSelectAllRows,i=e.sx,l=(0,D.Z)(e,R);return s?(0,p.jsxs)(j.Z,(0,d.Z)((0,d.Z)({direction:"row",alignItems:"center",sx:(0,d.Z)((0,d.Z)({pl:1,pr:2,top:0,left:0,width:1,zIndex:9,height:58,position:"absolute",bgcolor:"primary.lighter"},n&&{height:38}),i)},l),{},{children:[(0,p.jsx)(w.Z,{indeterminate:!!s&&s<r,checked:!!r&&s===r,onChange:function(e){return o(e.target.checked)}}),(0,p.jsxs)(P.Z,{variant:"subtitle2",sx:(0,d.Z)({ml:2,flexGrow:1,color:"primary.main"},n&&{ml:3}),children:[s," selected"]}),t&&t]})):null}var M=t(89891),A=t(25801),F=t(5446),O=["dense","onChangeDense","rowsPerPageOptions","sx"];function T(e){var n=e.dense,t=e.onChangeDense,r=e.rowsPerPageOptions,s=void 0===r?[5,10,25]:r,o=e.sx,i=(0,D.Z)(e,O);return(0,p.jsxs)(y.Z,{sx:(0,d.Z)({position:"relative"},o),children:[(0,p.jsx)(F.Z,(0,d.Z)((0,d.Z)({rowsPerPageOptions:s,component:"div"},i),{},{sx:{borderTopColor:"transparent"}})),t&&(0,p.jsx)(A.Z,{label:"Dense",control:(0,p.jsx)(M.Z,{checked:n,onChange:t}),sx:{pl:2,py:1.5,top:0,position:{sm:"absolute"}}})]})}},94952:function(e,n,t){t.d(n,{H:function(){return Ce},C:function(){return ie}});var r=t(4942),s=t(1413),o=t(29439),i=t(93433),l=t(72791),a=t(12065),c=t(61474),d=t(2101),x=t(57621),u=t(79836),h=t(5849),p=t(20068),Z=t(89164),g=t(53382),j=t(13400),m=t(39281),f=t(7055),b=t(18873),y=t(85159),w=t(84791),v=t(71839),C=t(23329),k=t(61005),S=t(93317),D=t(93288),P=t(40963),R=t(54406),I=t(37976),M=t(16386),A=t(64554),F=t(27938),O=t(36314),T=t(60220),W=t(56125),_=t(82626),L=t(9195),Q=t(13034),B=t(68745),E=t(49900),N=t(33203),z=t(94920),U=t(80184);function G(e){var n=e.row,t=e.selected,r=e.onViewRow,o=e.onSelectRow,i=e.onDeleteRow,l=n.items,a=n.status,c=n.orderNumber,d=n.createdAt,x=n.customer,u=n.totalQuantity,p=n.subTotal,Z=(0,v.k)(),g=(0,v.k)(),m=(0,z.S)(),f=(0,U.jsxs)(L.Z,{hover:!0,selected:t,children:[(0,U.jsx)(B.Z,{padding:"checkbox",children:(0,U.jsx)(Q.Z,{checked:t,onClick:o})}),(0,U.jsx)(B.Z,{children:(0,U.jsx)(A.Z,{onClick:r,sx:{cursor:"pointer","&:hover":{textDecoration:"underline"}},children:c})}),(0,U.jsxs)(B.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,U.jsx)(T.Z,{alt:x.name,src:x.avatarUrl,sx:{mr:2}}),(0,U.jsx)(E.Z,{primary:x.name,secondary:x.email,primaryTypographyProps:{typography:"body2"},secondaryTypographyProps:{component:"span",color:"text.disabled"}})]}),(0,U.jsx)(B.Z,{children:(0,U.jsx)(E.Z,{primary:(0,M.Z)(new Date(d),"dd MMM yyyy"),secondary:(0,M.Z)(new Date(d),"p"),primaryTypographyProps:{typography:"body2",noWrap:!0},secondaryTypographyProps:{mt:.5,component:"span",typography:"caption"}})}),(0,U.jsxs)(B.Z,{align:"center",children:[" ",u," "]}),(0,U.jsxs)(B.Z,{children:[" ",(0,N.e_)(p)," "]}),(0,U.jsx)(B.Z,{children:(0,U.jsx)(C.Z,{variant:"soft",color:("completed"===a?"success":"pending"===a&&"warning")||"cancelled"===a&&"error"||"default",children:a})}),(0,U.jsxs)(B.Z,{align:"right",sx:{px:1,whiteSpace:"nowrap"},children:[(0,U.jsx)(j.Z,{color:g.value?"inherit":"default",onClick:g.onToggle,sx:(0,s.Z)({},g.value&&{bgcolor:"action.hover"}),children:(0,U.jsx)(k.Z,{icon:"eva:arrow-ios-downward-fill"})}),(0,U.jsx)(j.Z,{color:m.open?"inherit":"default",onClick:m.onOpen,children:(0,U.jsx)(k.Z,{icon:"eva:more-vertical-fill"})})]})]}),b=(0,U.jsx)(L.Z,{children:(0,U.jsx)(B.Z,{sx:{p:0,border:"none"},colSpan:8,children:(0,U.jsx)(W.Z,{in:g.value,timeout:"auto",unmountOnExit:!0,sx:{bgcolor:"background.neutral"},children:(0,U.jsx)(O.Z,{component:F.Z,sx:{m:1.5},children:l.map((function(e){return(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",sx:{p:function(e){return e.spacing(1.5,2,1.5,1.5)},"&:not(:last-of-type)":{borderBottom:function(e){return"solid 2px ".concat(e.palette.background.neutral)}}},children:[(0,U.jsx)(T.Z,{src:e.coverUrl,variant:"rounded",sx:{width:48,height:48,mr:2}}),(0,U.jsx)(E.Z,{primary:e.name,secondary:e.sku,primaryTypographyProps:{typography:"body2"},secondaryTypographyProps:{component:"span",color:"text.disabled",mt:.5}}),(0,U.jsxs)(A.Z,{children:["x",e.quantity]}),(0,U.jsx)(A.Z,{sx:{width:110,textAlign:"right"},children:(0,N.e_)(e.price)})]},e.id)}))})})})});return(0,U.jsxs)(U.Fragment,{children:[f,b,(0,U.jsxs)(z.Z,{open:m.open,onClose:m.onClose,arrow:"right-top",sx:{width:140},children:[(0,U.jsxs)(_.Z,{onClick:function(){Z.onTrue(),m.onClose()},sx:{color:"error.main"},children:[(0,U.jsx)(k.Z,{icon:"solar:trash-bin-trash-bold"}),"Delete"]}),(0,U.jsxs)(_.Z,{onClick:function(){r(),m.onClose()},children:[(0,U.jsx)(k.Z,{icon:"solar:eye-bold"}),"View"]})]}),(0,U.jsx)(D.Q,{open:Z.value,onClose:Z.onFalse,title:"Delete",content:"Are you sure want to delete?",action:(0,U.jsx)(h.Z,{variant:"contained",color:"error",onClick:i,children:"Delete"})})]})}var H=t(53106),q=t(48550),K=t(63466);function $(e){var n=e.filters,t=e.onFilters,r=e.canReset,s=e.onResetFilters,o=(0,z.S)(),i=(0,l.useCallback)((function(e){t("name",e.target.value)}),[t]),a=(0,l.useCallback)((function(e){t("startDate",e)}),[t]),c=(0,l.useCallback)((function(e){t("endDate",e)}),[t]);return(0,U.jsxs)(U.Fragment,{children:[(0,U.jsxs)(O.Z,{spacing:2,alignItems:{xs:"flex-end",md:"center"},direction:{xs:"column",md:"row"},sx:{p:2.5,pr:{xs:2.5,md:1}},children:[(0,U.jsx)(H.M,{label:"Start date",value:n.startDate,onChange:a,slotProps:{textField:{fullWidth:!0}},sx:{maxWidth:{md:200}}}),(0,U.jsx)(H.M,{label:"End date",value:n.endDate,onChange:c,slotProps:{textField:{fullWidth:!0}},sx:{maxWidth:{md:200}}}),(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",spacing:2,flexGrow:1,sx:{width:1},children:[(0,U.jsx)(q.Z,{fullWidth:!0,value:n.name,onChange:i,placeholder:"Search customer or order number...",InputProps:{startAdornment:(0,U.jsx)(K.Z,{position:"start",children:(0,U.jsx)(k.Z,{icon:"eva:search-fill",sx:{color:"text.disabled"}})})}}),(0,U.jsx)(j.Z,{onClick:o.onOpen,children:(0,U.jsx)(k.Z,{icon:"eva:more-vertical-fill"})})]}),r&&(0,U.jsx)(h.Z,{color:"error",sx:{flexShrink:0},onClick:s,startIcon:(0,U.jsx)(k.Z,{icon:"solar:trash-bin-trash-bold"}),children:"Clear"})]}),(0,U.jsxs)(z.Z,{open:o.open,onClose:o.onClose,arrow:"right-top",sx:{width:140},children:[(0,U.jsxs)(_.Z,{onClick:function(){o.onClose()},children:[(0,U.jsx)(k.Z,{icon:"solar:printer-minimalistic-bold"}),"Print"]}),(0,U.jsxs)(_.Z,{onClick:function(){o.onClose()},children:[(0,U.jsx)(k.Z,{icon:"solar:import-bold"}),"Import"]}),(0,U.jsxs)(_.Z,{onClick:function(){o.onClose()},children:[(0,U.jsx)(k.Z,{icon:"solar:export-bold"}),"Export"]})]})]})}var V=t(45987),Y=t(85771),J=t(7017),X=["filters","onFilters","onResetFilters","results"],ee=["label","children","sx"];function ne(e){var n=e.filters,t=e.onFilters,r=e.onResetFilters,o=e.results,i=(0,V.Z)(e,X),l=(0,J.l2)(n.startDate,n.endDate);return(0,U.jsxs)(O.Z,(0,s.Z)((0,s.Z)({spacing:1.5},i),{},{children:[(0,U.jsxs)(A.Z,{sx:{typography:"body2"},children:[(0,U.jsx)("strong",{children:o}),(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",ml:.25},children:"results found"})]}),(0,U.jsxs)(O.Z,{flexGrow:1,spacing:1,direction:"row",flexWrap:"wrap",alignItems:"center",children:["all"!==n.status&&(0,U.jsx)(te,{label:"Status:",children:(0,U.jsx)(Y.Z,{size:"small",label:n.status,onDelete:function(){t("status","all")}})}),n.startDate&&n.endDate&&(0,U.jsx)(te,{label:"Date:",children:(0,U.jsx)(Y.Z,{size:"small",label:l,onDelete:function(){t("startDate",null),t("endDate",null)}})}),(0,U.jsx)(h.Z,{color:"error",onClick:r,startIcon:(0,U.jsx)(k.Z,{icon:"solar:trash-bin-trash-bold"}),children:"Clear"})]})]}))}function te(e){var n=e.label,t=e.children,r=e.sx,o=(0,V.Z)(e,ee);return(0,U.jsxs)(O.Z,(0,s.Z)((0,s.Z)({component:F.Z,variant:"outlined",spacing:1,direction:"row",sx:(0,s.Z)({p:1,borderRadius:1,overflow:"hidden",borderStyle:"dashed"},r)},o),{},{children:[(0,U.jsx)(A.Z,{component:"span",sx:{typography:"subtitle2"},children:n}),(0,U.jsx)(O.Z,{spacing:1,direction:"row",flexWrap:"wrap",children:t})]}))}var re=[{value:"all",label:"All"}].concat((0,i.Z)(y.s8)),se=[{id:"orderNumber",label:"Order",width:116},{id:"name",label:"Customer"},{id:"createdAt",label:"Date",width:140},{id:"totalQuantity",label:"Items",width:120,align:"center"},{id:"totalAmount",label:"Price",width:140},{id:"status",label:"Status",width:110},{id:"",width:88}],oe={name:"",status:"all",startDate:null,endDate:null};function ie(){var e=(0,I.x6)({defaultOrderBy:"orderNumber"}),n=(0,P.K$)(),t=(0,b.tv)(),i=(0,v.k)(),M=(0,l.useState)(y._Q),A=(0,o.Z)(M,2),F=A[0],O=A[1],T=(0,l.useState)(oe),W=(0,o.Z)(T,2),_=W[0],L=W[1],Q=!(!_.startDate||!_.endDate)&&_.startDate.getTime()>_.endDate.getTime(),B=function(e){var n=e.inputData,t=e.comparator,r=e.filters,s=e.dateError,o=r.status,i=r.name,l=r.startDate,a=r.endDate,c=n.map((function(e,n){return[e,n]}));c.sort((function(e,n){var r=t(e[0],n[0]);return 0!==r?r:e[1]-n[1]})),n=c.map((function(e){return e[0]})),i&&(n=n.filter((function(e){return-1!==e.orderNumber.toLowerCase().indexOf(i.toLowerCase())||-1!==e.customer.name.toLowerCase().indexOf(i.toLowerCase())||-1!==e.customer.email.toLowerCase().indexOf(i.toLowerCase())})));"all"!==o&&(n=n.filter((function(e){return e.status===o})));s||l&&a&&(n=n.filter((function(e){return(0,w.IO)(e.createdAt)>=(0,w.IO)(l)&&(0,w.IO)(e.createdAt)<=(0,w.IO)(a)})));return n}({inputData:F,comparator:(0,I.sQ)(e.order,e.orderBy),filters:_,dateError:Q}),E=B.slice(e.page*e.rowsPerPage,e.page*e.rowsPerPage+e.rowsPerPage),N=e.dense?52:72,z=!!_.name||"all"!==_.status||!!_.startDate&&!!_.endDate,H=!B.length&&z||!B.length,q=(0,l.useCallback)((function(n,t){e.onResetPage(),L((function(e){return(0,s.Z)((0,s.Z)({},e),{},(0,r.Z)({},n,t))}))}),[e]),K=(0,l.useCallback)((function(n){var t=F.filter((function(e){return e.id!==n}));O(t),e.onUpdatePageDeleteRow(E.length)}),[E.length,e,F]),V=(0,l.useCallback)((function(){var n=F.filter((function(n){return!e.selected.includes(n.id)}));O(n),e.onUpdatePageDeleteRows({totalRows:F.length,totalRowsInPage:E.length,totalRowsFiltered:B.length})}),[B.length,E.length,e,F]),Y=(0,l.useCallback)((function(){L(oe)}),[]),J=(0,l.useCallback)((function(e){t.push(f.H.dashboard.order.details(e))}),[t]),X=(0,l.useCallback)((function(e,n){q("status",n)}),[q]);return(0,U.jsxs)(U.Fragment,{children:[(0,U.jsxs)(Z.Z,{maxWidth:!n.themeStretch&&"lg",children:[(0,U.jsx)(R.Z,{heading:"List",links:[{name:"Dashboard",href:f.H.dashboard.root},{name:"Order",href:f.H.dashboard.order.root},{name:"List"}],sx:{mb:{xs:3,md:5}}}),(0,U.jsxs)(x.Z,{children:[(0,U.jsx)(d.Z,{value:_.status,onChange:X,sx:{px:2.5,boxShadow:function(e){return"inset 0 -2px 0 0 ".concat((0,a.Fq)(e.palette.grey[500],.08))}},children:re.map((function(e){return(0,U.jsx)(c.Z,{iconPosition:"end",value:e.value,label:e.label,icon:(0,U.jsxs)(C.Z,{variant:"all"===e.value||e.value===_.status?"filled":"soft",color:("completed"===e.value?"success":"pending"===e.value&&"warning")||"cancelled"===e.value&&"error"||"default",children:["all"===e.value&&y._Q.length,"completed"===e.value&&y._Q.filter((function(e){return"completed"===e.status})).length,"pending"===e.value&&y._Q.filter((function(e){return"pending"===e.status})).length,"cancelled"===e.value&&y._Q.filter((function(e){return"cancelled"===e.status})).length,"refunded"===e.value&&y._Q.filter((function(e){return"refunded"===e.status})).length]})},e.value)}))}),(0,U.jsx)($,{filters:_,onFilters:q,canReset:z,onResetFilters:Y}),z&&(0,U.jsx)(ne,{filters:_,onFilters:q,onResetFilters:Y,results:B.length,sx:{p:2.5,pt:0}}),(0,U.jsxs)(m.Z,{sx:{position:"relative",overflow:"unset"},children:[(0,U.jsx)(I.Z4,{dense:e.dense,numSelected:e.selected.length,rowCount:F.length,onSelectAllRows:function(n){return e.onSelectAllRows(n,F.map((function(e){return e.id})))},action:(0,U.jsx)(p.Z,{title:"Delete",children:(0,U.jsx)(j.Z,{color:"primary",onClick:i.onTrue,children:(0,U.jsx)(k.Z,{icon:"solar:trash-bin-trash-bold"})})})}),(0,U.jsx)(S.Z,{children:(0,U.jsxs)(u.Z,{size:e.dense?"small":"medium",sx:{minWidth:960},children:[(0,U.jsx)(I.K,{order:e.order,orderBy:e.orderBy,headLabel:se,rowCount:F.length,numSelected:e.selected.length,onSort:e.onSort,onSelectAllRows:function(n){return e.onSelectAllRows(n,F.map((function(e){return e.id})))}}),(0,U.jsxs)(g.Z,{children:[B.slice(e.page*e.rowsPerPage,e.page*e.rowsPerPage+e.rowsPerPage).map((function(n){return(0,U.jsx)(G,{row:n,selected:e.selected.includes(n.id),onSelectRow:function(){return e.onSelectRow(n.id)},onDeleteRow:function(){return K(n.id)},onViewRow:function(){return J(n.id)}},n.id)})),(0,U.jsx)(I.$W,{height:N,emptyRows:(0,I.fQ)(e.page,e.rowsPerPage,F.length)}),(0,U.jsx)(I.et,{notFound:H})]})]})})]}),(0,U.jsx)(I.S_,{count:B.length,page:e.page,rowsPerPage:e.rowsPerPage,onPageChange:e.onChangePage,onRowsPerPageChange:e.onChangeRowsPerPage,dense:e.dense,onChangeDense:e.onChangeDense})]})]}),(0,U.jsx)(D.Q,{open:i.value,onClose:i.onFalse,title:"Delete",content:(0,U.jsxs)(U.Fragment,{children:["Are you sure want to delete ",(0,U.jsxs)("strong",{children:[" ",e.selected.length," "]})," items?"]}),action:(0,U.jsx)(h.Z,{variant:"contained",color:"error",onClick:function(){V(),i.onFalse()},children:"Delete"})})]})}var le=t(24308),ae=t(50533),ce=t(94721),de=t(9585),xe=t(4567);function ue(e){var n=e.customer,t=e.delivery,r=e.payment,s=e.shippingAddress,o=(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(de.Z,{title:"Customer Info",action:(0,U.jsx)(j.Z,{children:(0,U.jsx)(k.Z,{icon:"solar:pen-bold"})})}),(0,U.jsxs)(O.Z,{direction:"row",sx:{p:3},children:[(0,U.jsx)(T.Z,{alt:n.name,src:n.avatarUrl,sx:{width:48,height:48,mr:2}}),(0,U.jsxs)(O.Z,{spacing:.5,alignItems:"flex-start",sx:{typography:"body2"},children:[(0,U.jsx)(xe.Z,{variant:"subtitle2",children:n.name}),(0,U.jsx)(A.Z,{sx:{color:"text.secondary"},children:n.email}),(0,U.jsxs)(A.Z,{children:["IP Address:",(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",ml:.25},children:n.ipAddress})]}),(0,U.jsx)(h.Z,{size:"small",color:"error",startIcon:(0,U.jsx)(k.Z,{icon:"mingcute:add-line"}),sx:{mt:1},children:"Add to Blacklist"})]})]})]}),i=(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(de.Z,{title:"Delivery",action:(0,U.jsx)(j.Z,{children:(0,U.jsx)(k.Z,{icon:"solar:pen-bold"})})}),(0,U.jsxs)(O.Z,{spacing:1.5,sx:{p:3,typography:"body2"},children:[(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",children:[(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",width:120,flexShrink:0},children:"Ship by"}),t.shipBy]}),(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",children:[(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",width:120,flexShrink:0},children:"Speedy"}),t.speedy]}),(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",children:[(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",width:120,flexShrink:0},children:"Tracking No."}),(0,U.jsx)(ae.Z,{underline:"always",color:"inherit",children:t.trackingNumber})]})]})]}),l=(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(de.Z,{title:"Shipping",action:(0,U.jsx)(j.Z,{children:(0,U.jsx)(k.Z,{icon:"solar:pen-bold"})})}),(0,U.jsxs)(O.Z,{spacing:1.5,sx:{p:3,typography:"body2"},children:[(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",children:[(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",width:120,flexShrink:0},children:"Address"}),s.fullAddress]}),(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",children:[(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",width:120,flexShrink:0},children:"Phone number"}),s.phoneNumber]})]})]}),a=(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(de.Z,{title:"Payment",action:(0,U.jsx)(j.Z,{children:(0,U.jsx)(k.Z,{icon:"solar:pen-bold"})})}),(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",sx:{p:3,typography:"body2"},children:[(0,U.jsx)(A.Z,{component:"span",sx:{color:"text.secondary",flexGrow:1},children:"Phone number"}),r.cardNumber,(0,U.jsx)(k.Z,{icon:"logos:mastercard",width:24,sx:{ml:.5}})]})]});return(0,U.jsxs)(x.Z,{children:[o,(0,U.jsx)(ce.Z,{sx:{borderStyle:"dashed"}}),i,(0,U.jsx)(ce.Z,{sx:{borderStyle:"dashed"}}),l,(0,U.jsx)(ce.Z,{sx:{borderStyle:"dashed"}}),a]})}function he(e){var n=e.items,t=e.shipping,r=e.discount,o=e.taxes,i=e.subTotal,l=e.totalAmount,a=(0,U.jsxs)(O.Z,{spacing:2,alignItems:"flex-end",sx:{my:3,textAlign:"right",typography:"body2"},children:[(0,U.jsxs)(O.Z,{direction:"row",children:[(0,U.jsx)(A.Z,{sx:{color:"text.secondary"},children:"Subtotal"}),(0,U.jsx)(A.Z,{sx:{width:160,typography:"subtitle2"},children:(0,N.e_)(i)||"-"})]}),(0,U.jsxs)(O.Z,{direction:"row",children:[(0,U.jsx)(A.Z,{sx:{color:"text.secondary"},children:"Shipping"}),(0,U.jsx)(A.Z,{sx:(0,s.Z)({width:160},t&&{color:"error.main"}),children:t?"- ".concat((0,N.e_)(t)):"-"})]}),(0,U.jsxs)(O.Z,{direction:"row",children:[(0,U.jsx)(A.Z,{sx:{color:"text.secondary"},children:"Discount"}),(0,U.jsx)(A.Z,{sx:(0,s.Z)({width:160},r&&{color:"error.main"}),children:r?"- ".concat((0,N.e_)(r)):"-"})]}),(0,U.jsxs)(O.Z,{direction:"row",children:[(0,U.jsx)(A.Z,{sx:{color:"text.secondary"},children:"Taxes"}),(0,U.jsx)(A.Z,{sx:{width:160},children:o?(0,N.e_)(o):"-"})]}),(0,U.jsxs)(O.Z,{direction:"row",sx:{typography:"subtitle1"},children:[(0,U.jsx)(A.Z,{children:"Total"}),(0,U.jsx)(A.Z,{sx:{width:160},children:(0,N.e_)(l)||"-"})]})]});return(0,U.jsxs)(x.Z,{children:[(0,U.jsx)(de.Z,{title:"Details"}),(0,U.jsxs)(O.Z,{sx:{px:3},children:[(0,U.jsx)(S.Z,{children:n.map((function(e){return(0,U.jsxs)(O.Z,{direction:"row",alignItems:"center",sx:{py:3,minWidth:640,borderBottom:function(e){return"dashed 2px ".concat(e.palette.background.neutral)}},children:[(0,U.jsx)(T.Z,{src:e.coverUrl,variant:"rounded",sx:{width:48,height:48,mr:2}}),(0,U.jsx)(E.Z,{primary:e.name,secondary:e.sku,primaryTypographyProps:{typography:"body2"},secondaryTypographyProps:{component:"span",color:"text.disabled",mt:.5}}),(0,U.jsxs)(A.Z,{sx:{typography:"body2"},children:["x",e.quantity]}),(0,U.jsx)(A.Z,{sx:{width:110,textAlign:"right",typography:"subtitle2"},children:(0,N.e_)(e.price)})]},e.id)}))}),a]})]})}var pe=t(89302);function Ze(e){var n=e.status,t=e.backLink,r=e.createdAt,s=e.orderNumber,o=e.statusOptions,i=e.onChangeStatus,l=(0,z.S)();return(0,U.jsxs)(U.Fragment,{children:[(0,U.jsxs)(O.Z,{spacing:3,direction:{xs:"column",md:"row"},sx:{mb:{xs:3,md:5}},children:[(0,U.jsxs)(O.Z,{spacing:1,direction:"row",alignItems:"flex-start",children:[(0,U.jsx)(j.Z,{component:pe.r,href:t,children:(0,U.jsx)(k.Z,{icon:"eva:arrow-ios-back-fill"})}),(0,U.jsxs)(O.Z,{spacing:.5,children:[(0,U.jsxs)(O.Z,{spacing:1,direction:"row",alignItems:"center",children:[(0,U.jsxs)(xe.Z,{variant:"h4",children:[" Order ",s," "]}),(0,U.jsx)(C.Z,{variant:"soft",color:("completed"===n?"success":"pending"===n&&"warning")||"cancelled"===n&&"error"||"default",children:n})]}),(0,U.jsx)(xe.Z,{variant:"body2",sx:{color:"text.disabled"},children:(0,w.zM)(r)})]})]}),(0,U.jsxs)(O.Z,{flexGrow:1,spacing:1.5,direction:"row",alignItems:"center",justifyContent:"flex-end",children:[(0,U.jsx)(h.Z,{color:"inherit",variant:"outlined",endIcon:(0,U.jsx)(k.Z,{icon:"eva:arrow-ios-downward-fill"}),onClick:l.onOpen,sx:{textTransform:"capitalize"},children:n}),(0,U.jsx)(h.Z,{color:"inherit",variant:"outlined",startIcon:(0,U.jsx)(k.Z,{icon:"solar:printer-minimalistic-bold"}),children:"Print"}),(0,U.jsx)(h.Z,{color:"inherit",variant:"contained",startIcon:(0,U.jsx)(k.Z,{icon:"solar:pen-bold"}),children:"Edit"})]})]}),(0,U.jsx)(z.Z,{open:l.open,onClose:l.onClose,arrow:"top-right",sx:{width:140},children:o.map((function(e){return(0,U.jsx)(_.Z,{selected:e.value===n,onClick:function(){l.onClose(),i(e.value)},children:e.label},e.value)}))})]})}var ge=t(36562),je=t(35651),me=t(27454),fe=t(28666),be=t(65552),ye=t(21658),we=t(23454);function ve(e){var n=e.history,t=(0,U.jsxs)(O.Z,{spacing:2,component:F.Z,variant:"outlined",sx:{p:2.5,minWidth:260,flexShrink:0,borderRadius:2,typography:"body2",borderStyle:"dashed"},children:[(0,U.jsxs)(O.Z,{spacing:.5,children:[(0,U.jsx)(A.Z,{sx:{color:"text.disabled"},children:"Order time"}),(0,w.zM)(n.orderTime)]}),(0,U.jsxs)(O.Z,{spacing:.5,children:[(0,U.jsx)(A.Z,{sx:{color:"text.disabled"},children:"Payment time"}),(0,w.zM)(n.orderTime)]}),(0,U.jsxs)(O.Z,{spacing:.5,children:[(0,U.jsx)(A.Z,{sx:{color:"text.disabled"},children:"Delivery time for the carrier"}),(0,w.zM)(n.orderTime)]}),(0,U.jsxs)(O.Z,{spacing:.5,children:[(0,U.jsx)(A.Z,{sx:{color:"text.disabled"},children:"Completion time"}),(0,w.zM)(n.orderTime)]})]}),s=(0,U.jsx)(ge.Z,{sx:(0,r.Z)({p:0,m:0},"& .".concat(ye.Z.root,":before"),{flex:0,padding:0}),children:n.timeline.map((function(e,t){var r=0===t,s=t===n.timeline.length-1;return(0,U.jsxs)(we.Z,{children:[(0,U.jsxs)(fe.Z,{children:[(0,U.jsx)(je.Z,{color:r?"primary":"grey"}),s?null:(0,U.jsx)(be.Z,{})]}),(0,U.jsxs)(me.Z,{children:[(0,U.jsx)(xe.Z,{variant:"subtitle2",children:e.title}),(0,U.jsx)(A.Z,{sx:{color:"text.disabled",typography:"caption",mt:.5},children:(0,w.zM)(e.time)})]})]},e.title)}))});return(0,U.jsxs)(x.Z,{children:[(0,U.jsx)(de.Z,{title:"History"}),(0,U.jsxs)(O.Z,{spacing:3,alignItems:{md:"flex-start"},direction:{xs:"column-reverse",md:"row"},sx:{p:3},children:[s,t]})]})}function Ce(){var e=(0,P.K$)(),n=(0,b.UO)().id,t=y._Q.filter((function(e){return e.id===n}))[0],r=(0,l.useState)(t.status),s=(0,o.Z)(r,2),i=s[0],a=s[1],c=(0,l.useCallback)((function(e){a(e)}),[]);return(0,U.jsxs)(Z.Z,{maxWidth:!e.themeStretch&&"lg",children:[(0,U.jsx)(Ze,{backLink:f.H.dashboard.order.root,orderNumber:t.orderNumber,createdAt:t.createdAt,status:i,onChangeStatus:c,statusOptions:y.s8}),(0,U.jsxs)(le.Z,{container:!0,spacing:3,children:[(0,U.jsx)(le.Z,{xs:12,md:8,children:(0,U.jsxs)(O.Z,{spacing:3,direction:{xs:"column-reverse",md:"column"},children:[(0,U.jsx)(he,{items:t.items,taxes:t.taxes,shipping:t.shipping,discount:t.discount,subTotal:t.subTotal,totalAmount:t.totalAmount}),(0,U.jsx)(ve,{history:t.history})]})}),(0,U.jsx)(le.Z,{xs:12,md:4,children:(0,U.jsx)(ue,{customer:t.customer,delivery:t.delivery,payment:t.payment,shippingAddress:t.shippingAddress})})]})]})}},33203:function(e,n,t){t.d(n,{FK:function(){return o},e_:function(){return i},f2:function(){return l},oe:function(){return c},v1:function(){return a}});var r=t(26098),s=t.n(r);function o(e){return s()(e).format()}function i(e){return d(e?s()(e).format("$0,0.00"):"",".00")}function l(e){return d(e?s()(Number(e)/100).format("0.0%"):"",".0")}function a(e){return d(e?s()(e).format("0.00a"):"",".00")}function c(e){return d(e?s()(e).format("0.0 b"):"",".0")}function d(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:".00",t=e.includes(n);return t?e.replace(n,""):e}}}]);
//# sourceMappingURL=4952.32f2eab0.chunk.js.map