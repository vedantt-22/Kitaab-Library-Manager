import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  OnDestroy
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective implements OnDestroy {

  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private destroy$ = new Subject<void>();

  private requiredRoles: string[] = [];

  @Input()
  set appRole(role: string | string[]) {
    this.requiredRoles = Array.isArray(role) ? role : [role];
    this.updateView();
  }

  constructor() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateView());
  }

  private updateView(): void {
    this.viewContainer.clear();

    const currentUser = this.authService.currentUser;

    if (
      currentUser &&
      this.requiredRoles.includes(currentUser.role)
    ) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}