import{L as e,_ as t,C as r,r as n,E as o,D as i,I as a,J as s}from"./vendor-firebase-core-gOV-Wzb-.js";
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
 */const c=new Map,p={activated:!1,tokenObservers:[]};function h(e){return c.get(e)||Object.assign({},p)}const l=3e4,d=96e4;
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
 */class u{constructor(e,t,r,n,o){if(this.operation=e,this.retryPolicy=t,this.getWaitDuration=r,this.lowerBound=n,this.upperBound=o,this.pending=null,this.nextErrorWaitInterval=n,n>o)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new s,this.pending.promise.catch(e=>{}),await(t=this.getNextRun(e),new Promise(e=>{setTimeout(e,t)})),this.pending.resolve(),await this.pending.promise,this.pending=new s,this.pending.promise.catch(e=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(r){this.retryPolicy(r)?this.process(!1).catch(()=>{}):this.stop()}var t;
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
 */}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const e=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),e}}}const g=new o("appCheck","AppCheck",{"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"});function k(e){if(!h(e).activated)throw g.create("use-before-activation",{appName:e.name})}
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
 */const f="firebase-app-check-store";let w=null;function v(e,t){return async function(e,t){const r=(await(w||(w=new Promise((e,t)=>{try{const r=indexedDB.open("firebase-app-check-database",1);r.onsuccess=t=>{e(t.target.result)},r.onerror=e=>{var r;t(g.create("storage-open",{originalErrorMessage:null===(r=e.target.error)||void 0===r?void 0:r.message}))},r.onupgradeneeded=e=>{const t=e.target.result;0===e.oldVersion&&t.createObjectStore(f,{keyPath:"compositeKey"})}}catch(r){t(g.create("storage-open",{originalErrorMessage:null==r?void 0:r.message}))}}),w))).transaction(f,"readwrite"),n=r.objectStore(f).put({compositeKey:e,value:t});return new Promise((e,t)=>{n.onsuccess=t=>{e()},r.onerror=e=>{var r;t(g.create("storage-set",{originalErrorMessage:null===(r=e.target.error)||void 0===r?void 0:r.message}))}})}(function(e){return`${e.options.appId}-${e.name}`}
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
 */(e),t)}const m=new e("@firebase/app-check");function E(e,t){return i()?v(e,t).catch(e=>{m.warn(`Failed to write token to IndexedDB. Error: ${e}`)}):Promise.resolve()}
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
 */const b={error:"UNKNOWN_ERROR"};async function T(e,t=!1,r=!1){const n=e.app;k(n);const o=h(n);let i,a=o.token;if(a&&!x(a)&&(o.token=void 0,a=void 0),!a){const e=await o.cachedTokenPromise;e&&(x(e)?a=e:await E(n,void 0))}if(!t&&a&&x(a))return{token:a.token};let s,c=!1;try{o.exchangeTokenPromise||(o.exchangeTokenPromise=o.provider.getToken().finally(()=>{o.exchangeTokenPromise=void 0}),c=!0),a=await h(n).exchangeTokenPromise}catch(p){"appCheck/throttled"===p.code||"appCheck/initial-throttle"===p.code?m.warn(p.message):r&&m.error(p),i=p}return a?i?s=x(a)?{token:a.token,internalError:i}:I(i):(s={token:a.token},o.token=a,await E(n,a)):s=I(i),c&&function(e,t){const r=h(e).tokenObservers;for(const n of r)try{"EXTERNAL"===n.type&&null!=t.error?n.error(t.error):n.next(t)}catch(p){}}(n,s),s}function P(e,t){const r=h(e),n=r.tokenObservers.filter(e=>e.next!==t);0===n.length&&r.tokenRefresher&&r.tokenRefresher.isRunning()&&r.tokenRefresher.stop(),r.tokenObservers=n}function y(e){const{app:t}=e,r=h(t);let n=r.tokenRefresher;n||(n=function(e){const{app:t}=e;return new u(async()=>{let r;if(r=h(t).token?await T(e,!0):await T(e),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{const e=h(t);if(e.token){let t=e.token.issuedAtTimeMillis+.5*(e.token.expireTimeMillis-e.token.issuedAtTimeMillis)+3e5;const r=e.token.expireTimeMillis-3e5;return t=Math.min(t,r),Math.max(0,t-Date.now())}return 0},l,d)}(e),r.tokenRefresher=n),!n.isRunning()&&r.isTokenAutoRefreshEnabled&&n.start()}function x(e){return e.expireTimeMillis-Date.now()>0}function I(e){return{token:(t=b,a.encodeString(JSON.stringify(t),!1)),error:e};var t}
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
 */class C{constructor(e,t){this.app=e,this.heartbeatServiceProvider=t}_delete(){const{tokenObservers:e}=h(this.app);for(const t of e)P(this.app,t.next);return Promise.resolve()}}function M(e){return{getToken:t=>T(e,t),getLimitedUseToken:()=>async function(e){const t=e.app;k(t);const{provider:r}=h(t);{const{token:e}=await r.getToken();return{token:e}}}(e),addTokenListener:t=>function(e,t,r,n){const{app:o}=e,i=h(o),a={next:r,error:n,type:t};if(i.tokenObservers=[...i.tokenObservers,a],i.token&&x(i.token)){const t=i.token;Promise.resolve().then(()=>{r({token:t.token}),y(e)}).catch(()=>{})}i.cachedTokenPromise.then(()=>y(e))}(e,"INTERNAL",t),removeTokenListener:t=>P(e.app,t)}}const R="app-check-internal";t(new r("app-check",e=>function(e,t){return new C(e,t)}(e.getProvider("app").getImmediate(),e.getProvider("heartbeat")),"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider(R).initialize()})),t(new r(R,e=>M(e.getProvider("app-check").getImmediate()),"PUBLIC").setInstantiationMode("EXPLICIT")),n("@firebase/app-check","0.10.1");
