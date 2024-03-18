(function(){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const S=Symbol("Comlink.proxy"),L=Symbol("Comlink.endpoint"),z=Symbol("Comlink.releaseProxy"),k=Symbol("Comlink.finalizer"),w=Symbol("Comlink.thrown"),M=e=>typeof e=="object"&&e!==null||typeof e=="function",_={canHandle:e=>M(e)&&e[S],serialize(e){const{port1:t,port2:r}=new MessageChannel;return P(e,t),[r,[r]]},deserialize(e){return e.start(),W(e)}},N={canHandle:e=>M(e)&&w in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},A=new Map([["proxy",_],["throw",N]]);function F(e,t){for(const r of e)if(t===r||r==="*"||r instanceof RegExp&&r.test(t))return!0;return!1}function P(e,t=globalThis,r=["*"]){t.addEventListener("message",function a(n){if(!n||!n.data)return;if(!F(r,n.origin)){console.warn(`Invalid origin '${n.origin}' for comlink proxy`);return}const{id:g,type:s,path:c}=Object.assign({path:[]},n.data),u=(n.data.argumentList||[]).map(m);let o;try{const i=c.slice(0,-1).reduce((l,d)=>l[d],e),f=c.reduce((l,d)=>l[d],e);switch(s){case"GET":o=f;break;case"SET":i[c.slice(-1)[0]]=m(n.data.value),o=!0;break;case"APPLY":o=f.apply(i,u);break;case"CONSTRUCT":{const l=new f(...u);o=U(l)}break;case"ENDPOINT":{const{port1:l,port2:d}=new MessageChannel;P(e,d),o=D(l,[l])}break;case"RELEASE":o=void 0;break;default:return}}catch(i){o={value:i,[w]:0}}Promise.resolve(o).catch(i=>({value:i,[w]:0})).then(i=>{const[f,l]=p(i);t.postMessage(Object.assign(Object.assign({},f),{id:g}),l),s==="RELEASE"&&(t.removeEventListener("message",a),O(t),k in e&&typeof e[k]=="function"&&e[k]())}).catch(i=>{const[f,l]=p({value:new TypeError("Unserializable return value"),[w]:0});t.postMessage(Object.assign(Object.assign({},f),{id:g}),l)})}),t.start&&t.start()}function H(e){return e.constructor.name==="MessagePort"}function O(e){H(e)&&e.close()}function W(e,t){return x(e,[],t)}function E(e){if(e)throw new Error("Proxy has been released and is not useable")}function R(e){return y(e,{type:"RELEASE"}).then(()=>{O(e)})}const h=new WeakMap,b="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(h.get(e)||0)-1;h.set(e,t),t===0&&R(e)});function j(e,t){const r=(h.get(t)||0)+1;h.set(t,r),b&&b.register(e,t,e)}function V(e){b&&b.unregister(e)}function x(e,t=[],r=function(){}){let a=!1;const n=new Proxy(r,{get(g,s){if(E(a),s===z)return()=>{V(n),R(e),a=!0};if(s==="then"){if(t.length===0)return{then:()=>n};const c=y(e,{type:"GET",path:t.map(u=>u.toString())}).then(m);return c.then.bind(c)}return x(e,[...t,s])},set(g,s,c){E(a);const[u,o]=p(c);return y(e,{type:"SET",path:[...t,s].map(i=>i.toString()),value:u},o).then(m)},apply(g,s,c){E(a);const u=t[t.length-1];if(u===L)return y(e,{type:"ENDPOINT"}).then(m);if(u==="bind")return x(e,t.slice(0,-1));const[o,i]=T(c);return y(e,{type:"APPLY",path:t.map(f=>f.toString()),argumentList:o},i).then(m)},construct(g,s){E(a);const[c,u]=T(s);return y(e,{type:"CONSTRUCT",path:t.map(o=>o.toString()),argumentList:c},u).then(m)}});return j(n,e),n}function I(e){return Array.prototype.concat.apply([],e)}function T(e){const t=e.map(p);return[t.map(r=>r[0]),I(t.map(r=>r[1]))]}const C=new WeakMap;function D(e,t){return C.set(e,t),e}function U(e){return Object.assign(e,{[S]:!0})}function p(e){for(const[t,r]of A)if(r.canHandle(e)){const[a,n]=r.serialize(e);return[{type:"HANDLER",name:t,value:a},n]}return[{type:"RAW",value:e},C.get(e)||[]]}function m(e){switch(e.type){case"HANDLER":return A.get(e.name).deserialize(e.value);case"RAW":return e.value}}function y(e,t,r){return new Promise(a=>{const n=B();e.addEventListener("message",function g(s){!s.data||!s.data.id||s.data.id!==n||(e.removeEventListener("message",g),a(s.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:n},t),r)})}function B(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}const G=e=>{console.log(`	iterations: ${e} * 1,000,000 loop`);let t=0;for(let r=0;r<e;r++)for(let a=0;a<1e6;a++)t+=Math.random();return console.log(`	result:${t}`),t};var $=Object.freeze({__proto__:null,workerBlockingFunc:e=>(console.log("Web Worker 処理開始"),G(e))});P($)})();
