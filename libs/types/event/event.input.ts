import { EventCategory, EventStatus } from '../../enums/event.enum';
import { Direction } from '../../enums/common.enum';

export interface EventInput {
	eventTitle: string;
	eventCategory: EventCategory;
	eventDescription: string;
	eventImage?: string;
}

export interface EventUpdate {
	_id: string;
	eventTitle?: string;
	eventCategory?: EventCategory;
	eventDescription?: string;
	eventImage?: string;
	eventStatus?: EventStatus;
}

export interface AllEventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: {
		eventStatus?: EventStatus;
		eventCategory?: EventCategory;
		text?: string;
	};
}
