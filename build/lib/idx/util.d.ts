import { APIError, IdxRemediation, IdxResponse } from '../types';
export declare function createApiError(res: any): APIError;
export declare function getAllValues(idxRemediation: IdxRemediation): string[];
export declare function getRequiredValues(idxRemediation: IdxRemediation): any[];
export declare function findRemediationByName(idxRemediation: IdxRemediation, name: string): import("./types").IdxRemeditionValue;
export declare function getIdxRemediation(remediators: any, idxRemediations: any): any;
export declare function isErrorResponse(idxResponse: IdxResponse): boolean;
export declare function titleCase(str: string): string;
