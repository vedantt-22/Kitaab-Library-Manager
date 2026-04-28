import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from '../models/issue.model';

@Pipe({
  name: 'overdueStatus',
  standalone: true,
  pure: true
})
export class OverdueStatusPipe implements PipeTransform {

  transform(issue: Issue): 'active' | 'overdue' | 'returned' {

    if (issue.status === 'returned') {
      return 'returned';
    }

    if (issue.isOverdue) {
      return 'overdue';
    }

    return 'active';
  }
}