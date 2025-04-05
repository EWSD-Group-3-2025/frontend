import { USER_ROLE } from '@/constants';

export interface Book {
	id: number;
	bookName: string;
	bookDescription: string;
	categoryId: number;
	categoryName: string;
	difficultyLevel: string;
	rating: number;
	organizationName: string;
	organizationUrl: string;
	bookUrl: string;
	uploaderId: number;
	uploaderName: string;
	createdAt: Date;
	updatedAt: Date;
}

export enum BookCategory {
	COMPUTER_SCIENCE = 0,
	PROGRAMMING = 1,
	PROJECT_MANAGEMENT = 2,
	DATABASE = 3,
	OPERATION_SYSTEM = 4,
}
