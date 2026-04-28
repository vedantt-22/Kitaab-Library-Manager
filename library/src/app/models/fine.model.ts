export interface Fine {
  issueId: number;
  bookId: number;
  // Note: The server route we updated sends bookTitle, 
  // but if you want the full object, ensure the server maps it.
  book?: {
    id: number;
    title: string;
    author?: string;
  };
  bookTitle?: string; // Added to match your Express map output
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  daysOverdue?: number;
  fine: number; // Changed from 'fine' to 'fineAmount' to match Server
  finePaid: boolean;
  // Changed 'active' to 'issued' to match your Database status logic
  status: 'issued' | 'returned' | 'overdue'; 
}

export interface FinesResponse {
  fines: Fine[];
  totalFines: number;
  paidFines: number;
  pendingFines: number;
}

export interface FinePreview {
  issueId: number;
  dueDate: string;
  gracePeriodDays: number;
  overdueDays: number;
  finePerDay: number;
  calculatedFine: number;
  maxFinePerBook: number;
  isOverdue: boolean;
  status: 'issued' | 'returned' | 'overdue'; // Use the same union here
}