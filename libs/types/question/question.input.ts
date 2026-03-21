import { Direction } from '../../enums/common.enum';

export interface QuestionInput {
	productId: string;
	questionText: string;
}

export interface AnswerInput {
	_id: string;
	answerText: string;
}

interface QISearch {
	productId: string;
}

export interface QuestionsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: QISearch;
}
