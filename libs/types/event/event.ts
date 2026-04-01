import { EventCategory, EventStatus } from '../../enums/event.enum';

export interface Event {
	_id: string;
	eventTitle: string;
	eventCategory: EventCategory;
	eventDescription: string;
	eventImage?: string;
	eventStatus: EventStatus;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Events {
	list: Event[];
	metaCounter: { total: number }[];
}
