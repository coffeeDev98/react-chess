(this["webpackJsonpreact-chess"]=this["webpackJsonpreact-chess"]||[]).push([[0],{14:function(e,t,n){},18:function(e,t,n){},24:function(e,t,n){"use strict";n.r(t);var s=n(1),c=n.n(s),o=n(7),i=n.n(o),r=(n(14),n(9)),a=n(0),d=n(8),l=(n(18),n(3)),u=n.p+"static/media/wQ.b069e38b.svg",b=n.p+"static/media/wR.a5a16b36.svg",j=n.p+"static/media/wB.6a5db4e0.svg",f=n.p+"static/media/wN.72ce2510.svg",p=n(2),v=n(20);var h=function(){var e=Object(s.useState)(new v("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")),t=Object(a.a)(e,1)[0],n=Object(s.useState)(t.fen()),c=Object(a.a)(n,2),o=c[0],i=c[1],h=Object(s.useState)(),m=Object(a.a)(h,2),O=m[0],w=m[1],g=Object(s.useState)(!1),P=Object(a.a)(g,2),x=P[0],k=P[1],C=Object(s.useState)(),N=Object(a.a)(C,2),S=N[0],B=N[1],E=Object(s.useState)(window.innerWidth),q=Object(a.a)(E,2),Q=q[0],R=q[1],y=Object(s.useState)(window.innerHeight),M=Object(a.a)(y,2),F=M[0],K=M[1];Object(s.useEffect)((function(){return L(),window.addEventListener("resize",L),function(){return window.removeEventListener("resize",L)}}),[]),Object(s.useEffect)((function(){console.log("pendingMove: ",O)}),[O]);var L=function(){R(window.innerWidth),K(window.innerHeight)},I=function(e){var n=O[0],s=O[1];t.move({from:n,to:s,promotion:e}),i(t.fen()),k(!1)},T={fen:o,coordinates:!0,turnColor:"w"===t.turn()?l.a[0]:l.a[1],addPieceZIndex:!0,autoCastle:!0,lastMove:S,highlight:{lastMove:!0},selectable:{enabled:!0},movable:function(){var e=new Map;return t.SQUARES.forEach((function(n){var s=t.moves({square:n,verbose:!0});s.length&&e.set(n,s.map((function(e){return e.to})))})),{free:!1,dests:e,showDests:!0,events:{after:function(e,n,s){return function(e){for(var n=t.moves({verbose:!0}),s=0,c=n.length;s<c;s++)if(-1!==n[s].flags.indexOf("p")&&n[s].from===e.from)return w([e.from,e.to]),void k(!0);var o=t.move(e);o&&(console.log(o.san),i(t.fen()),B([e.from,e.to]))}({from:e,to:n})}},rookCastle:!0}}(),events:{select:function(e){}}};return Object(p.jsxs)("div",{className:"app",id:"chessboard",children:[Object(p.jsxs)("div",{className:"side-section",children:[x&&Object(p.jsxs)("div",{className:"piece-promotion-prompt",children:["Promote To?",Object(p.jsxs)("div",{className:"roles",children:[Object(p.jsx)("span",{role:"presentation",onClick:function(){return I("q")},children:Object(p.jsx)("img",{src:u,alt:"",style:{width:50}})}),Object(p.jsx)("span",{role:"presentation",onClick:function(){return I("r")},children:Object(p.jsx)("img",{src:b,alt:"",style:{width:50}})}),Object(p.jsx)("span",{role:"presentation",onClick:function(){return I("b")},children:Object(p.jsx)("img",{src:j,alt:"",style:{width:50}})}),Object(p.jsx)("span",{role:"presentation",onClick:function(){return I("n")},children:Object(p.jsx)("img",{src:f,alt:"",style:{width:50}})})]})]}),"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"!==t.fen()&&Object(p.jsx)("div",{className:"undo-btn",onClick:function(){var e=t.undo();B([null===e||void 0===e?void 0:e.from,null===e||void 0===e?void 0:e.to]),i(t.fen())},children:"Undo"})]}),Object(p.jsx)("div",{className:"main-chessboard",children:Object(p.jsx)(d.a,{width:Q<F?.5*Q:.5*F,height:Q<F?.5*Q:.5*F,config:Object(r.a)({},T)})})]})},m=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,25)).then((function(t){var n=t.getCLS,s=t.getFID,c=t.getFCP,o=t.getLCP,i=t.getTTFB;n(e),s(e),c(e),o(e),i(e)}))};i.a.render(Object(p.jsx)(c.a.StrictMode,{children:Object(p.jsx)(h,{})}),document.getElementById("root")),m()}},[[24,1,2]]]);
//# sourceMappingURL=main.964be1e0.chunk.js.map