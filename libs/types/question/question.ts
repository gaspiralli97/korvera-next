import { QuestionStatus } from '../../enums/question.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

export interface Question {
	_id: string;
	productId: string;
	memberId: string;
	questionText: string;
	questionStatus: QuestionStatus;
	answerText?: string;
	answeredBy?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
	answeredByData?: Member;
}

export interface Questions {
	list: Question[];
	metaCounter: TotalCounter[];
}
