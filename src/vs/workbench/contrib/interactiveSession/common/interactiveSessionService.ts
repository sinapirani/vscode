/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from 'vs/base/common/cancellation';
import { IDisposable } from 'vs/base/common/lifecycle';
import { URI } from 'vs/base/common/uri';
import { ProviderResult } from 'vs/editor/common/languages';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { InteractiveSessionModel } from 'vs/workbench/contrib/interactiveSession/common/interactiveSessionModel';

export interface IInteractiveSession {
	id: number;
	requesterUsername: string;
	requesterAvatarIconUri?: URI;
	responderUsername: string;
	responderAvatarIconUri?: URI;
	dispose?(): void;
}

export interface IInteractiveRequest {
	session: IInteractiveSession;
	message: string;
}

export interface IInteractiveResponse {
	session: IInteractiveSession;
	followups?: string[];
}

export interface IInteractiveProgress {
	responsePart: string;
}

export interface IPersistedInteractiveState { }
export interface IInteractiveProvider {
	readonly id: string;
	readonly progressiveRenderingEnabled?: boolean;
	readonly iconUrl?: string;
	prepareSession(initialState: IPersistedInteractiveState | undefined, token: CancellationToken): ProviderResult<IInteractiveSession | undefined>;
	resolveRequest?(session: IInteractiveSession, context: any, token: CancellationToken): ProviderResult<IInteractiveRequest>;
	provideSuggestions?(token: CancellationToken): ProviderResult<string[] | undefined>;
	provideReply(request: IInteractiveRequest, progress: (progress: IInteractiveProgress) => void, token: CancellationToken): ProviderResult<IInteractiveResponse>;
}

export const IInteractiveSessionService = createDecorator<IInteractiveSessionService>('IInteractiveSessionService');

export interface IInteractiveSessionService {
	_serviceBrand: undefined;
	registerProvider(provider: IInteractiveProvider): IDisposable;
	progressiveRenderingEnabled(providerId: string): boolean;
	startSession(providerId: string, allowRestoringSession: boolean, token: CancellationToken): Promise<InteractiveSessionModel | undefined>;

	/**
	 * Returns whether the request was accepted.
	 */
	sendRequest(sessionId: number, message: string, token: CancellationToken): boolean;
	clearSession(sessionId: number): void;
	acceptNewSessionState(sessionId: number, state: any): void;
	addInteractiveRequest(context: any): void;
	provideSuggestions(providerId: string, token: CancellationToken): Promise<string[] | undefined>;
}
