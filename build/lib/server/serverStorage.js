/*!
 * Copyright (c) 2018-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { AuthSdkError } from '../errors';
const NodeCache = require('node-cache'); // commonJS module cannot be imported without esModuleInterop
const sharedStorage = new NodeCache(); // this is a SHARED memory storage to support a stateless http server
class ServerCookies {
    constructor(nodeCache) {
        this.nodeCache = nodeCache;
    }
    set(name, value, expiresAt) {
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!(Date.parse(expiresAt))) {
            // Time to expiration in seconds
            var ttl = (Date.parse(expiresAt) - Date.now()) / 1000;
            this.nodeCache.set(name, value, ttl);
        }
        else {
            this.nodeCache.set(name, value);
        }
        return this.get(name);
    }
    get(name) {
        return this.nodeCache.get(name);
    }
    delete(name) {
        return this.nodeCache.del(name);
    }
}
// Building this as an object allows us to mock the functions in our tests
class ServerStorage {
    constructor(nodeCache) {
        this.nodeCache = nodeCache;
        this.storage = new ServerCookies(nodeCache);
    }
    testStorageType(storageType) {
        var supported = false;
        switch (storageType) {
            case 'memory':
                supported = true;
                break;
            default:
                break;
        }
        return supported;
    }
    getStorageByType(storageType) {
        let storageProvider = null;
        switch (storageType) {
            case 'memory':
                storageProvider = this.getStorage();
                break;
            default:
                throw new AuthSdkError(`Unrecognized storage option: ${storageType}`);
                break;
        }
        return storageProvider;
    }
    findStorageType() {
        return 'memory';
    }
    // will be removed in next version. OKTA-362589
    getHttpCache() {
        return null; // stubbed in server.js
    }
    // shared in-memory using node cache
    getStorage() {
        return {
            getItem: this.nodeCache.get,
            setItem: (key, value) => {
                this.nodeCache.set(key, value, '2200-01-01T00:00:00.000Z');
            }
        };
    }
}
export default new ServerStorage(sharedStorage);
