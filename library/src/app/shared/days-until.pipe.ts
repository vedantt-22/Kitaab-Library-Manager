import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysUntil',
  standalone: true,
  pure: false 
})
export class DaysUntilPipe implements PipeTransform {

  transform(dueDate: string | null | undefined): string {

    if (!dueDate) return '';

    const now = new Date();
    const due = new Date(dueDate);

    const diff = Math.ceil(
      (due.getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (diff > 0) {
      return `${diff} day${diff > 1 ? 's' : ''} remaining`;
    }

    if (diff === 0) {
      return 'Due today';
    }

    return `${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''} overdue`;
  }
}