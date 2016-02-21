/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

/**
 * Create a syntax highighter with a fully declarative JSON style lexer description
 * using regular expressions.
 */

import {IBracketPair, ISuggestSupport} from 'vs/editor/common/modes';
import {ILexer} from 'vs/editor/common/modes/monarch/monarchCommon';
import {CharacterPair, IRichEditConfiguration} from 'vs/editor/common/modes/supports/richEditSupport';
import {PredefinedResultSuggestSupport, TextualAndPredefinedResultSuggestSupport} from 'vs/editor/common/modes/supports/suggestSupport';
import {IEditorWorkerService} from 'vs/editor/common/services/editorWorkerService';
import {IModelService} from 'vs/editor/common/services/modelService';

export function createRichEditSupport(lexer: ILexer): IRichEditConfiguration {

	function toBracket(input:IBracketPair): CharacterPair {
		return [input.open, input.close];
	}

	function toBrackets(input:IBracketPair[]): CharacterPair[] {
		return input.map(toBracket);
	}

	return {

		wordPattern: lexer.wordDefinition,

		comments: {
			lineComment: lexer.lineComment,
			blockComment: [lexer.blockCommentStart, lexer.blockCommentEnd]
		},

		brackets: toBrackets(lexer.standardBrackets),

		__electricCharacterSupport: {
			brackets: lexer.standardBrackets,
			// regexBrackets: lexer.enhancedBrackets,
			caseInsensitive: lexer.ignoreCase,
			embeddedElectricCharacters: lexer.outdentTriggers.split('')
		},

		__characterPairSupport: {
			autoClosingPairs: lexer.autoClosingPairs
		}
	};
}

export function createSuggestSupport(modelService: IModelService, editorWorkerService: IEditorWorkerService, modeId:string, lexer:ILexer): ISuggestSupport {
	if (lexer.suggestSupport.textualCompletions) {
		return new TextualAndPredefinedResultSuggestSupport(
			modeId,
			modelService,
			editorWorkerService,
			lexer.suggestSupport.snippets,
			lexer.suggestSupport.triggerCharacters,
			lexer.suggestSupport.disableAutoTrigger
		);
	} else {
		return new PredefinedResultSuggestSupport(
			modeId,
			modelService,
			lexer.suggestSupport.snippets,
			lexer.suggestSupport.triggerCharacters,
			lexer.suggestSupport.disableAutoTrigger
		);
	}
}
