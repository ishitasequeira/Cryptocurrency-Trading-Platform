import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthActionTypes, LogIn, LogInSuccess, LogInFailure } from '../actions/user.actions';


@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
  ) { }

  @Effect()
  LogIn: Observable<any> = this.actions
    .ofType(AuthActionTypes.LOGIN)
    .map((action: LogIn) => action.payload)
    .switchMap(payload => {
      return this.authService.logIn(payload.username, payload.password)
        .map((result) => {
          console.log(result.user);
          return new LogInSuccess({ user: result.User, token: result.token });
        })
        .catch((error) => {
          console.log(error);
          return Observable.of(new LogInFailure({ error: error }));
        });
    });

  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap((result) => {
    //  localStorage.setItem('token', result.payload.token);
    //   localStorage.setItem('user', result.payload.user);
      this.router.navigateByUrl('/register');
    })
  );

  @Effect({ dispatch: false })
  LogInFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE)
  );
}