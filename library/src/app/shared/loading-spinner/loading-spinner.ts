import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinner {}