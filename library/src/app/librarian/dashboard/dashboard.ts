import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  Observable,
  catchError,
  map,
  startWith,
  of,
  forkJoin
} from 'rxjs';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';
import {
  StatsService,
  DashboardStats,
  OverdueReportResponse,
  OverdueIssue
} from '../stats-service/stats.service';

interface DashboardViewModel {
  stats: DashboardStats | null;
  overdueReports: OverdueIssue[];
  isLoading: boolean;
  errorMessage: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  vm$!: Observable<DashboardViewModel>;

  constructor(private statsService: StatsService) {
    this.initializeStream();
  }

  private initializeStream(): void {

    this.vm$ = forkJoin({
      stats: this.statsService.getDashboardStats(),
      overdueResponse: this.statsService.getOverdueReport()
    }).pipe(

      map(({ stats, overdueResponse }) => ({
        stats,
        overdueReports: overdueResponse.overdueIssues,
        isLoading: false,
        errorMessage: null
      })),

      startWith({
        stats: null,
        overdueReports: [],
        isLoading: true,
        errorMessage: null
      }),

      catchError(() =>
        of({
          stats: null,
          overdueReports: [],
          isLoading: false,
          errorMessage: 'Failed to load dashboard statistics.'
        })
      )
    );
  }

  trackByReport(index: number, report: OverdueIssue): number {
    return report.issueId;
  }
}