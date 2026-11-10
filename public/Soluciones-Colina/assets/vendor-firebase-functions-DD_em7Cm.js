import{F as e,d as t,l as n,z as r,n as a,k as s,p as i,u as o,_ as c,C as u,r as l,c as d}from"./vendor-firebase-core-gOV-Wzb-.js";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function h(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function p(e){if(null==e)return null;if(e instanceof Number&&(e=e.valueOf()),"number"==typeof e&&isFinite(e))return e;if(!0===e||!1===e)return e;if("[object String]"===Object.prototype.toString.call(e))return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(e=>p(e));if("function"==typeof e||"object"==typeof e)return h(e,e=>p(e));throw new Error("Data cannot be encoded in JSON: "+e)}function f(e){if(null==e)return e;if(e["@type"])switch(e["@type"]){case"type.googleapis.com/google.protobuf.Int64Value":case"type.googleapis.com/google.protobuf.UInt64Value":{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(e=>f(e)):"function"==typeof e||"object"==typeof e?h(e,e=>f(e)):e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m="functions",g={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w extends e{constructor(e,t,n){super(`${m}/${e}`,t||""),this.details=n,Object.setPrototypeOf(this,w.prototype)}}function k(e,t){let n,r=function(e){if(e>=200&&e<300)return"ok";switch(e){case 0:case 500:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}(e),a=r;try{const e=t&&t.error;if(e){const t=e.status;if("string"==typeof t){if(!g[t])return new w("internal","internal");r=g[t],a=t}const s=e.message;"string"==typeof s&&(a=s),n=e.details,void 0!==n&&(n=f(n))}}catch(s){}return"ok"===r?null:new w(r,a,n)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y{constructor(e,t,n,r){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,d(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(e=>this.auth=e,()=>{}),this.messaging||n.get().then(e=>this.messaging=e,()=>{}),this.appCheck||null==r||r.get().then(e=>this.appCheck=e,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return null==e?void 0:e.accessToken}catch(e){return}}async getMessagingToken(){if(this.messaging&&"Notification"in self&&"granted"===Notification.permission)try{return await this.messaging.getToken()}catch(e){return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){return{authToken:await this.getAuthToken(),messagingToken:await this.getMessagingToken(),appCheckToken:await this.getAppCheckToken(e)}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const T="us-central1",v=/^data: (.*?)(?:\n|$)/;class A{constructor(e,t,n,r,a=T,s=(...e)=>fetch(...e)){this.app=e,this.fetchImpl=s,this.emulatorOrigin=null,this.contextProvider=new y(e,t,n,r),this.cancelAllRequests=new Promise(e=>{this.deleteService=()=>Promise.resolve(e())});try{const e=new URL(a);this.customDomain=e.origin+("/"===e.pathname?"":e.pathname),this.region=T}catch(i){this.customDomain=null,this.region=a}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;if(null!==this.emulatorOrigin){return`${this.emulatorOrigin}/${t}/${this.region}/${e}`}return null!==this.customDomain?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function E(e,t,n){const r=r=>function(e,t,n,r){const a=e._url(t);return I(e,a,n,r)}(e,t,r,n||{});return r.stream=(n,r)=>function(e,t,n,r){const a=e._url(t);return O(e,a,n,r||{})}(e,t,n,r),r}async function b(e,t,n,r){let a;n["Content-Type"]="application/json";try{a=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch(i){return{status:0,json:null}}let s=null;try{s=await a.json()}catch(i){}return{status:a.status,json:s}}async function N(e,t){const n={},r=await e.contextProvider.getContext(t.limitedUseAppCheckTokens);return r.authToken&&(n.Authorization="Bearer "+r.authToken),r.messagingToken&&(n["Firebase-Instance-ID-Token"]=r.messagingToken),null!==r.appCheckToken&&(n["X-Firebase-AppCheck"]=r.appCheckToken),n}async function I(e,t,n,r){const a={data:n=p(n)},s=await N(e,r),i=function(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new w("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}(r.timeout||7e4),o=await Promise.race([b(t,a,s,e.fetchImpl),i.promise,e.cancelAllRequests]);if(i.cancel(),!o)throw new w("cancelled","Firebase Functions instance was deleted.");const c=k(o.status,o.json);if(c)throw c;if(!o.json)throw new w("internal","Response is not valid JSON object.");let u=o.json.data;if(void 0===u&&(u=o.json.result),void 0===u)throw new w("internal","Response is missing data field.");return{data:f(u)}}async function O(e,t,n,r){var a;const s={data:n=p(n)},i=await N(e,r);let o,c,u;i["Content-Type"]="application/json",i.Accept="text/event-stream";try{o=await e.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:i,signal:null==r?void 0:r.signal})}catch(h){if(h instanceof Error&&"AbortError"===h.name){const e=new w("cancelled","Request was cancelled.");return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const e=k(0,null);return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const l=new Promise((e,t)=>{c=e,u=t});null===(a=null==r?void 0:r.signal)||void 0===a||a.addEventListener("abort",()=>{const e=new w("cancelled","Request was cancelled.");u(e)});const d=function(e,t,n,r){const a=(e,r)=>{const a=e.match(v);if(!a)return;const s=a[1];try{const e=JSON.parse(s);if("result"in e)return void t(f(e.result));if("message"in e)return void r.enqueue(f(e.message));if("error"in e){const t=k(0,e);return r.error(t),void n(t)}}catch(i){if(i instanceof w)return r.error(i),void n(i)}},s=new TextDecoder;return new ReadableStream({start(t){let i="";return o();async function o(){if(null==r?void 0:r.aborted){const e=new w("cancelled","Request was cancelled");return t.error(e),n(e),Promise.resolve()}try{const{value:c,done:u}=await e.read();if(u)return i.trim()&&a(i.trim(),t),void t.close();if(null==r?void 0:r.aborted){const r=new w("cancelled","Request was cancelled");return t.error(r),n(r),void(await e.cancel())}i+=s.decode(c,{stream:!0});const l=i.split("\n");i=l.pop()||"";for(const e of l)e.trim()&&a(e.trim(),t);return o()}catch(c){const e=c instanceof w?c:k(0,null);t.error(e),n(e)}}},cancel:()=>e.cancel()})}(o.body.getReader(),c,u,null==r?void 0:r.signal);return{stream:{[Symbol.asyncIterator](){const e=d.getReader();return{async next(){const{value:t,done:n}=await e.read();return{value:t,done:n}},return:async()=>(await e.cancel(),{done:!0,value:void 0})}}},data:l}}const C="@firebase/functions",D="0.12.9";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function S(e=a(),s=T){const i=n(t(e),m).getImmediate({identifier:s}),o=r("functions");return o&&P(i,...o),i}function P(e,n,r){!function(e,t,n){const r=s(t);e.emulatorOrigin=`http${r?"s":""}://${t}:${n}`,r&&(i(e.emulatorOrigin),o("Functions",!0))}(t(e),n,r)}function j(e,n,r){return E(t(e),n,r)}function R(e,n,r){return function(e,t,n){const r=r=>I(e,t,r,n||{});return r.stream=(n,r)=>O(e,t,n,r||{}),r}(t(e),n,r)}var x;c(new u(m,(e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),a=e.getProvider("messaging-internal"),s=e.getProvider("app-check-internal");return new A(n,r,a,s,t)},"PUBLIC").setMultipleInstances(!0)),l(C,D,x),l(C,D,"esm2017");export{w as FunctionsError,P as connectFunctionsEmulator,S as getFunctions,j as httpsCallable,R as httpsCallableFromURL};
