(this.webpackJsonpmedicus=this.webpackJsonpmedicus||[]).push([[25],{143:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return y}));var n=r(12),c=r.n(n),a=r(11),s=r(52),i=r(13),o=r(9),l=r(0),u=r(31),j=r(51),d=r(32),p=r(50),b=r(1);function h(e){var t=Object(l.useState)(""),r=Object(o.a)(t,2),n=r[0],s=r[1],u=Object(l.useState)({name:"",rate:0}),j=Object(o.a)(u,2),h=j[0],m=j[1];function f(e){return v.apply(this,arguments)}function v(){return(v=Object(i.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:m(Object(a.a)(Object(a.a)({},h),{},Object(d.a)({},t.target.name,t.target.value)));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function O(){return(O=Object(i.a)(c.a.mark((function t(r){var n,i,o;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r.preventDefault(),t.prev=1,n={name:h.name,rate:h.rate},t.next=5,fetch("/api/users/".concat(e.user.username,"/services"),{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(e.session.authToken)},body:JSON.stringify(n)});case 5:return i=t.sent,t.next=8,i.json();case 8:if(o=t.sent,i.ok){t.next=11;break}throw new Error(o.message);case 11:n.id=o.id,e.appendService&&e.appendService(n),m(Object(a.a)(Object(a.a)({},h),{},{title:"",content:""})),t.next=20;break;case 16:t.prev=16,t.t0=t.catch(1),console.error("Failed to add new service. ".concat(t.t0)),s(t.t0.message);case 20:case"end":return t.stop()}}),t,null,[[1,16]])})))).apply(this,arguments)}return Object(b.jsxs)(p.a,{className:"container-fluid",handleSubmit:function(e){return O.apply(this,arguments)},children:[n&&Object(b.jsx)(p.f,{className:"justify-content-center",children:Object(b.jsx)("div",{className:"alert alert-danger",role:"alert",children:n})}),Object(b.jsxs)(p.f,{children:[Object(b.jsxs)(p.c,{className:"col-12 col-md",children:[Object(b.jsx)(p.d,{for:"servicesForm01",className:"md-font-sm text-muted",children:"Service Name"}),Object(b.jsx)("input",{id:"servicesForm01",name:"name",type:"text",className:"form-control",value:h.name,onChange:f,placeholder:'Try "Health check-up"'})]}),Object(b.jsxs)(p.c,{className:"col-12 col-md",children:[Object(b.jsx)(p.d,{for:"servicesForm02",className:"md-font-sm text-muted",children:"Rate ($)"}),Object(b.jsx)("input",{id:"servicesForm02",name:"rate",type:"number",className:"form-control",value:h.rate,onChange:f,placeholder:"00.00",min:"0",step:"0.01"})]}),Object(b.jsx)(p.c,{className:"col-sm-auto align-self-end",children:Object(b.jsx)(p.g,{children:"Add"})})]})]})}var m=r(17),f=r(23);function v(e){return Object(b.jsx)(j.l,{children:Object(b.jsx)(m.e,{children:Object(b.jsx)(m.g,{children:Object(b.jsx)(m.a,{className:"md-font-sm text-center text-muted",children:"No service available"})})})})}function O(e){function t(){return(t=Object(i.a)(c.a.mark((function t(r){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r.preventDefault(),e.handleDelete&&e.handleDelete(e.service.id);case 2:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var r=e.service.username,n=Object(f.o)({user:e.session})===r;return Object(b.jsx)(j.l,{children:Object(b.jsx)(m.e,{children:Object(b.jsxs)(m.g,{children:[Object(b.jsx)(m.a,{className:"align-self-center",children:Object(b.jsxs)(m.g,{children:[Object(b.jsx)(m.a,{className:"align-self-center",children:e.service.name}),Object(b.jsx)(m.a,{className:"col-auto",children:Object(b.jsx)(f.b,{value:e.service.rate})})]})}),Object(b.jsx)(m.a,{className:"col-auto",children:n&&Object(b.jsx)(j.i,{children:Object(b.jsx)(j.j,{handleClick:function(e){return t.apply(this,arguments)},children:"Delete"})})})]})})})}function x(e){return Object(b.jsx)(j.k,{children:0!==e.services.length?Object(b.jsx)(b.Fragment,{children:e.services.map((function(t,r){return Object(b.jsx)(O,{session:e.session,service:t,handleDelete:e.deleteService},r)}))}):Object(b.jsx)(v,{})})}function y(e){var t=Object(l.useState)({services:[],limit:10}),r=Object(o.a)(t,2),n=r[0],d=r[1];function p(){return(p=Object(i.a)(c.a.mark((function t(){var r,i,o,l;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,r="/api/users/".concat(e.user.username,"/services"),(i=new URLSearchParams).append("page",Math.ceil(n.services.length/n.limit)),i.append("limit",n.limit),t.next=7,fetch("".concat(r,"?").concat(i.toString()),{headers:{Authorization:"Bearer ".concat(e.session.authToken)}});case 7:return o=t.sent,t.next=10,o.json();case 10:if(l=t.sent,o.ok){t.next=13;break}throw new Error(l.message);case 13:d((function(e){var t=[].concat(Object(s.a)(e.services),Object(s.a)(l));return Object(a.a)(Object(a.a)({},e),{},{services:t})})),t.next=19;break;case 16:t.prev=16,t.t0=t.catch(0),console.error("Failed to append more services. ".concat(t.t0));case 19:case"end":return t.stop()}}),t,null,[[0,16]])})))).apply(this,arguments)}function m(){return(m=Object(i.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:d((function(e){var r=[t].concat(Object(s.a)(e.services));return Object(a.a)(Object(a.a)({},e),{},{services:r})}));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function f(){return(f=Object(i.a)(c.a.mark((function t(r){var s,i;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("/api/users/".concat(e.user.username,"/services/").concat(r),{method:"DELETE",credentials:"same-origin",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(e.session.authToken)}});case 3:return s=t.sent,t.next=6,s.json();case 6:if(i=t.sent,s.ok){t.next=9;break}throw new Error(i.message);case 9:d((function(e){var t=n.services.filter((function(e){return e.id!==r}));return Object(a.a)(Object(a.a)({},e),{},{services:t})})),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(0),console.error("Failed to delete service- ".concat(r,". ").concat(t.t0));case 15:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}return Object(b.jsxs)(b.Fragment,{children:[Object(b.jsxs)(j.e,{children:[Object(b.jsx)(j.a,{title:"Services",children:!e.disableEdit&&Object(b.jsx)(j.d,{target:"userServiceAdd01",expandIcon:"add",collapseIcon:"clear"})}),Object(b.jsx)(j.g,{id:"userServiceAdd01",children:Object(b.jsx)(h,{session:e.session,user:e.user,appendService:function(e){return m.apply(this,arguments)}})}),Object(b.jsx)(x,{session:e.session,services:n.services,deleteService:function(e){return f.apply(this,arguments)}})]}),Object(b.jsx)(u.a,{callback:function(){return p.apply(this,arguments)}})]})}},52:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var n=r(24);var c=r(20);function a(e){return function(e){if(Array.isArray(e))return Object(n.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(c.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}}}]);
//# sourceMappingURL=25.afaeeeb2.chunk.js.map