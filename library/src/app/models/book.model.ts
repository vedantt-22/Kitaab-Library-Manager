export interface Book {
  id: number;
  title: string;
  description: string; // book description
  author: string;
  isbn: string;
  publisher: string;
  publishedYear: number;
  publishedDate: string; // YYYY-MM-DD
  category: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  position: string; // shelf location e.g. "A-101"
  addedDate: string;
  addedBy: string;
}