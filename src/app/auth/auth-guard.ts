import {CanLoad, Route, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as fromRoot from '../app.reducer';
import {take} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanLoad {

  constructor(
    private store: Store<fromRoot.State>
  ) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(fromRoot.getIsAuthenticated)
      .pipe(
        take(1)
      );
  }
}
