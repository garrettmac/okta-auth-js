/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { OktaAuth, InteractOptions } from '../types';
import { interact } from './interact';

export type CancelOptions = InteractOptions;

export async function cancel (authClient: OktaAuth, options: CancelOptions) {
  return interact(authClient, options)
    .then(({ idxResponse }) => {
      return idxResponse.actions.cancel();
    })
    .finally(() => {
      authClient.transactionManager.clear();
    });
}
