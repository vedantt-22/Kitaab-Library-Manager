import { Book } from './book.model';

export interface Issue {
  id: number;
  bookId: number;
  userId: number;
  category?: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'active' | 'returned' | 'overdue';
  renewCount: number;   // max 2
  fineAmount: number;
  finePaid: boolean;
  daysUntilDue: number;
  isOverdue: boolean;
  book?: Pick<Book, 'id' | 'title' | 'author' | 'isbn'>;
}

