"use strict";(self.webpackChunkiit29062023=self.webpackChunkiit29062023||[]).push([[4887],{44887:function(e,n,r){r.d(n,{ZP:function(){return se},JG:function(){return Y}});var t=r(74165),i=r(15861),u=r(1413),a=r(29439),o=r(72791),c=r(37248),f=r(37762),s=new WeakMap,d={},l={},v=function(){},p=v(),g=Object,h=function(e){return e===p},b=function(e){return"function"==typeof e},w=function(e,n){return(0,u.Z)((0,u.Z)({},e),n)},y="undefined",k=typeof window!=y,m=typeof document!=y,x=function(e,n){var r=s.get(e);return[function(){return!h(n)&&e.get(n)||d},function(t){if(!h(n)){var i=e.get(n);n in l||(l[n]=i),r[5](n,w(i,t),i||d)}},r[6],function(){return!h(n)&&n in l?l[n]:!h(n)&&e.get(n)||d}]},E=new WeakMap,Z=0,_=function e(n){var r,t,i=typeof n,u=n&&n.constructor,a=u==Date;if(g(n)!==n||a||u==RegExp)r=a?n.toJSON():"symbol"==i?n.toString():"string"==i?JSON.stringify(n):""+n;else{if(r=E.get(n))return r;if(r=++Z+"~",E.set(n,r),u==Array){for(r="@",t=0;t<n.length;t++)r+=e(n[t])+",";E.set(n,r)}if(u==g){r="#";for(var o=g.keys(n).sort();!h(t=o.pop());)h(n[t])||(r+=t+":"+e(n[t])+",");E.set(n,r)}}return r},O=!0,R=k&&window.addEventListener?[window.addEventListener.bind(window),window.removeEventListener.bind(window)]:[v,v],S=(0,a.Z)(R,2),L=S[0],T=S[1],V={isOnline:function(){return O},isVisible:function(){var e=m&&document.visibilityState;return h(e)||"hidden"!==e}},C={initFocus:function(e){return m&&document.addEventListener("visibilitychange",e),L("focus",e),function(){m&&document.removeEventListener("visibilitychange",e),T("focus",e)}},initReconnect:function(e){var n=function(){O=!0,e()},r=function(){O=!1};return L("online",n),L("offline",r),function(){T("online",n),T("offline",r)}}},D=!o.useId,I=!k||"Deno"in window,P=function(e){return k&&typeof window.requestAnimationFrame!=y?window.requestAnimationFrame(e):setTimeout(e,1)},A=I?o.useEffect:o.useLayoutEffect,M="undefined"!==typeof navigator&&navigator.connection,F=!I&&M&&(["slow-2g","2g"].includes(M.effectiveType)||M.saveData),W=function(e){if(b(e))try{e=e()}catch(r){e=""}var n=e;return[e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?_(e):"",n]},q=0,J=function(){return++q},N=3,U=0,$=2,j=1;function G(){return H.apply(this,arguments)}function H(){return H=(0,i.Z)((0,t.Z)().mark((function e(){var n,r,u,o,c,f,d,l,v,g,y,k,m,E,Z,_,O,R,S,L,T,V=arguments;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(T=function(){return T=(0,i.Z)((0,t.Z)().mark((function e(n){var i,u,c,d,l,g,w,Z,_,O,R,S,L,T,V,C,D,I,P,A,M,F,q;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i=W(n),u=(0,a.Z)(i,1),c=u[0]){e.next=3;break}return e.abrupt("return");case 3:if(d=x(o,c),l=(0,a.Z)(d,2),g=l[0],w=l[1],Z=s.get(o),_=(0,a.Z)(Z,3),O=_[0],R=_[1],S=_[2],L=O[c],T=function(){return k&&(delete S[c],L&&L[0])?L[0](2).then((function(){return g().data})):g().data},!(r.length<3)){e.next=9;break}return e.abrupt("return",T());case 9:if(V=f,D=J(),R[c]=[D,0],I=!h(y),P=g(),A=P.data,M=P._c,F=h(M)?A:M,I&&(y=b(y)?y(F):y,w({data:y,_c:F})),b(V))try{V=V(F)}catch(t){C=t}if(!V||!b(V.then)){e.next=30;break}return e.next=22,V.catch((function(e){C=e}));case 22:if(V=e.sent,D===R[c][0]){e.next=29;break}if(!C){e.next=26;break}throw C;case 26:return e.abrupt("return",V);case 29:C&&I&&m(C)&&(v=!0,w({data:V=F,_c:p}));case 30:return v&&(C||(b(v)&&(V=v(V,F)),w({data:V,_c:p}))),R[c][1]=J(),e.next=34,T();case 34:if(q=e.sent,w({_c:p}),!C){e.next=40;break}if(!E){e.next=39;break}throw C;case 39:return e.abrupt("return");case 40:return e.abrupt("return",v?q:V);case 41:case"end":return e.stop()}}),e)}))),T.apply(this,arguments)},L=function(e){return T.apply(this,arguments)},n=V.length,r=new Array(n),u=0;u<n;u++)r[u]=V[u];if(o=r[0],c=r[1],f=r[2],d=r[3],l=w({populateCache:!0,throwOnError:!0},"boolean"===typeof d?{revalidate:d}:d||{}),v=l.populateCache,g=l.rollbackOnError,y=l.optimisticData,k=!1!==l.revalidate,m=function(e){return"function"===typeof g?g(e):!1!==g},E=l.throwOnError,!b(c)){e.next=17;break}for(Z=c,_=[],O=o.keys(),R=O.next();!R.done;R=O.next())S=R.value,!/^\$(inf|sub)\$/.test(S)&&Z(o.get(S)._k)&&_.push(S);return e.abrupt("return",Promise.all(_.map(L)));case 17:return e.abrupt("return",L(c));case 18:case"end":return e.stop()}}),e)}))),H.apply(this,arguments)}var z=function(e,n){for(var r in e)e[r][0]&&e[r][0](n)},B=function(e,n){if(!s.has(e)){var r=w(C,n),t={},i=G.bind(p,e),u=v,a={},o=function(e,n){var r=a[e]||[];return a[e]=r,r.push(n),function(){return r.splice(r.indexOf(n),1)}},c=function(n,r,t){e.set(n,r);var i=a[n];if(i){var u,o=(0,f.Z)(i);try{for(o.s();!(u=o.n()).done;){(0,u.value)(r,t)}}catch(c){o.e(c)}finally{o.f()}}},d=function(){if(!s.has(e)&&(s.set(e,[t,{},{},{},i,c,o]),!I)){var n=r.initFocus(setTimeout.bind(p,z.bind(p,t,0))),a=r.initReconnect(setTimeout.bind(p,z.bind(p,t,1)));u=function(){n&&n(),a&&a(),s.delete(e)}}};return d(),[e,i,d,u]}return[e,s.get(e)[4]]},K=B(new Map),Q=(0,a.Z)(K,2),X=Q[0],Y=Q[1],ee=w({onLoadingSlow:v,onSuccess:v,onError:v,onErrorRetry:function(e,n,r,t,i){var u=r.errorRetryCount,a=i.retryCount,o=~~((Math.random()+.5)*(1<<(a<8?a:8)))*r.errorRetryInterval;!h(u)&&a>u||setTimeout(t,o,i)},onDiscarded:v,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:F?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:F?5e3:3e3,compare:function(e,n){return _(e)==_(n)},isPaused:function(){return!1},cache:X,mutate:Y,fallback:{}},V),ne=function(e,n){var r=w(e,n);if(n){var t=e.use,i=e.fallback,u=n.use,a=n.fallback;t&&u&&(r.use=t.concat(u)),i&&a&&(r.fallback=w(i,a))}return r},re=(0,o.createContext)({}),te=k&&window.__SWR_DEVTOOLS_USE__,ie=te?window.__SWR_DEVTOOLS_USE__:[],ue=function(e){return b(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}]},ae=function(){return w(ee,(0,o.useContext)(re))},oe=ie.concat((function(e){return function(n,r,t){var i=r&&function(){var e=W(n),t=(0,a.Z)(e,1),i=t[0],u=s.get(X),o=(0,a.Z)(u,4),c=o[3],f=c[i];return f?(delete c[i],f):r.apply(void 0,arguments)};return e(n,i,t)}}));te&&(window.__SWR_DEVTOOLS_REACT__=o);var ce,fe={dedupe:!0},se=(g.defineProperty((function(e){var n=e.value,r=(0,o.useContext)(re),t=b(n),i=(0,o.useMemo)((function(){return t?n(r):n}),[t,r,n]),u=(0,o.useMemo)((function(){return t?i:ne(r,i)}),[t,r,i]),a=i&&i.provider,c=(0,o.useRef)(p);a&&!c.current&&(c.current=B(a(u.cache||X),i));var f=c.current;return f&&(u.cache=f[0],u.mutate=f[1]),A((function(){if(f)return f[2]&&f[2](),f[3]}),[]),(0,o.createElement)(re.Provider,w(e,{value:u}))}),"defaultValue",{value:ee}),ce=function(e,n,r){var f=r.cache,d=r.compare,l=r.suspense,v=r.fallbackData,g=r.revalidateOnMount,y=r.revalidateIfStale,k=r.refreshInterval,m=r.refreshWhenHidden,E=r.refreshWhenOffline,Z=r.keepPreviousData,_=s.get(f),O=(0,a.Z)(_,3),R=O[0],S=O[1],L=O[2],T=W(e),V=(0,a.Z)(T,2),C=V[0],M=V[1],F=(0,o.useRef)(!1),q=(0,o.useRef)(!1),H=(0,o.useRef)(C),z=(0,o.useRef)(n),B=(0,o.useRef)(r),K=function(){return B.current},Q=function(){return K().isVisible()&&K().isOnline()},X=x(f,C),Y=(0,a.Z)(X,4),ee=Y[0],ne=Y[1],re=Y[2],te=Y[3],ie=(0,o.useRef)({}).current,ue=h(v)?r.fallback[C]:v,ae=function(e,n){for(var r in ie){var t=r;if("data"===t){if(!d(e[t],n[t])){if(!h(e[t]))return!1;if(!d(he,n[t]))return!1}}else if(n[t]!==e[t])return!1}return!0},oe=(0,o.useMemo)((function(){var e=!!C&&!!n&&(h(g)?!K().isPaused()&&!l&&(!!h(y)||y):g),r=function(n){var r=w(n);return delete r._k,e?(0,u.Z)({isValidating:!0,isLoading:!0},r):r},t=ee(),i=te(),a=r(t),o=t===i?a:r(i),c=a;return[function(){var e=r(ee());return ae(e,c)?(c.data=e.data,c.isLoading=e.isLoading,c.isValidating=e.isValidating,c.error=e.error,c):(c=e,e)},function(){return o}]}),[f,C]),ce=(0,c.useSyncExternalStore)((0,o.useCallback)((function(e){return re(C,(function(n,r){ae(r,n)||e()}))}),[f,C]),oe[0],oe[1]),se=!F.current,de=R[C]&&R[C].length>0,le=ce.data,ve=h(le)?ue:le,pe=ce.error,ge=(0,o.useRef)(ve),he=Z?h(le)?ge.current:le:ve,be=!(de&&!h(pe))&&(se&&!h(g)?g:!K().isPaused()&&(l?!h(ve)&&y:h(ve)||y)),we=!!(C&&n&&se&&be),ye=h(ce.isValidating)?we:ce.isValidating,ke=h(ce.isLoading)?we:ce.isLoading,me=(0,o.useCallback)(function(){var e=(0,i.Z)((0,t.Z)().mark((function e(n){var i,u,o,c,f,s,l,v,g,w,y,k,m,x,E,Z;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i=z.current,C&&i&&!q.current&&!K().isPaused()){e.next=3;break}return e.abrupt("return",!1);case 3:return c=!0,f=n||{},s=!L[C]||!f.dedupe,l=function(){return D?!q.current&&C===H.current&&F.current:C===H.current},v={isValidating:!1,isLoading:!1},g=function(){ne(v)},w=function(){var e=L[C];e&&e[1]===o&&delete L[C]},y={isValidating:!0},h(ee().data)&&(y.isLoading=!0),e.prev=12,s&&(ne(y),r.loadingTimeout&&h(ee().data)&&setTimeout((function(){c&&l()&&K().onLoadingSlow(C,r)}),r.loadingTimeout),L[C]=[i(M),J()]),k=(0,a.Z)(L[C],2),u=k[0],o=k[1],e.next=19,u;case 19:if(u=e.sent,s&&setTimeout(w,r.dedupingInterval),L[C]&&L[C][1]===o){e.next=24;break}return s&&l()&&K().onDiscarded(C),e.abrupt("return",!1);case 24:if(v.error=p,m=S[C],h(m)||!(o<=m[0]||o<=m[1]||0===m[1])){e.next=30;break}return g(),s&&l()&&K().onDiscarded(C),e.abrupt("return",!1);case 30:x=ee().data,v.data=d(x,u)?x:u,s&&l()&&K().onSuccess(u,C,r),e.next=41;break;case 35:e.prev=35,e.t0=e.catch(12),w(),E=K(),Z=E.shouldRetryOnError,E.isPaused()||(v.error=e.t0,s&&l()&&(E.onError(e.t0,C,E),(!0===Z||b(Z)&&Z(e.t0))&&Q()&&E.onErrorRetry(e.t0,C,E,(function(e){var n=R[C];n&&n[0]&&n[0](N,e)}),{retryCount:(f.retryCount||0)+1,dedupe:!0})));case 41:return c=!1,g(),e.abrupt("return",!0);case 44:case"end":return e.stop()}}),e,null,[[12,35]])})));return function(n){return e.apply(this,arguments)}}(),[C,f]),xe=(0,o.useCallback)((function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return G.apply(void 0,[f,H.current].concat(n))}),[]);if(A((function(){z.current=n,B.current=r,h(le)||(ge.current=le)})),A((function(){if(C){var e=me.bind(p,fe),n=0,r=function(e,n,r){var t=n[e]||(n[e]=[]);return t.push(r),function(){var e=t.indexOf(r);e>=0&&(t[e]=t[t.length-1],t.pop())}}(C,R,(function(r){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(r==U){var i=Date.now();K().revalidateOnFocus&&i>n&&Q()&&(n=i+K().focusThrottleInterval,e())}else if(r==j)K().revalidateOnReconnect&&Q()&&e();else{if(r==$)return me();if(r==N)return me(t)}}));return q.current=!1,H.current=C,F.current=!0,ne({_k:M}),be&&(h(ve)||I?e():P(e)),function(){q.current=!0,r()}}}),[C]),A((function(){var e;function n(){var n=b(k)?k(ee().data):k;n&&-1!==e&&(e=setTimeout(r,n))}function r(){ee().error||!m&&!K().isVisible()||!E&&!K().isOnline()?n():me(fe).then(n)}return n(),function(){e&&(clearTimeout(e),e=-1)}}),[k,m,E,C]),(0,o.useDebugValue)(he),l&&h(ve)&&C){if(!D&&I)throw new Error("Fallback data is required when using suspense in SSR.");throw z.current=n,B.current=r,q.current=!1,h(pe)?me(fe):pe}return{mutate:xe,get data(){return ie.data=!0,he},get error(){return ie.error=!0,pe},get isValidating(){return ie.isValidating=!0,ye},get isLoading(){return ie.isLoading=!0,ke}}},function(){for(var e=ae(),n=arguments.length,r=new Array(n),t=0;t<n;t++)r[t]=arguments[t];for(var i=ue(r),u=(0,a.Z)(i,3),o=u[0],c=u[1],f=u[2],s=ne(e,f),d=ce,l=s.use,v=(l||[]).concat(oe),p=v.length;p--;)d=v[p](d);return d(o,c||s.fetcher||null,s)})}}]);
//# sourceMappingURL=4887.0d0b19a9.chunk.js.map