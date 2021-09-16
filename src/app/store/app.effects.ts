import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ModalService } from '../components/modal.service';
import { CONFIRMATION_URLs } from '../constants/endpoints';
import { IApiResult } from '../interfaces/api-result.interface';
import { ApiService } from '../services/api.service';
import {
  AppActionTypes,
  CompleteProcess,
  CompleteProcessSuccess,
  CompletingProcess,
  LoadEmployeeDetail,
  LoadingTransactions,
  LoadTransactions,
  LoadTransactionsSuccess,
  Login,
  LoginSuccess,
  Resend,
  ResendSuccess,
  SaveForm,
  SaveFormSuccess,
  SavingForm,
} from './app.action';
import { IAppState } from './app.state';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private store: Store<IAppState>,
    private modalService: ModalService
  ) {}

  loadTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadTransactions>(AppActionTypes.LOAD_TRANSACTIONS),
      map((action) => action.payload),
      switchMap((payload) =>
        this.apiService
          .read(
            `${CONFIRMATION_URLs.getTransactions}?refid=${payload.refId}&usercode=${payload.userCode}`
          )
          .pipe(
            map((data: IApiResult) => {
              if (data.success && data.results) {
                this.store.dispatch(new LoadingTransactions(false));
                const employeeDetails = {
                  employee_name: data.results[0].employee_name,
                  ext_user_email: data.results[0].ext_user_email,
                  employee_image: data.results[0].employee_image,
                };
                this.store.dispatch(new LoadEmployeeDetail(employeeDetails));
                return new LoadTransactionsSuccess(<any[]>data.results);
              } else {
                this.store.dispatch(new LoadingTransactions(false));
                Swal.fire({
                  title: 'Error!',
                  text: data.errorMessage
                    ? data.errorMessage
                    : 'Something went wrong. Form data could not be loaded.',
                  icon: 'error',
                  confirmButtonText: 'Close',
                });
                return new LoadTransactionsSuccess([]);
              }
            }),
            catchError(() => {
              this.store.dispatch(new LoadingTransactions(false));
              return EMPTY;
            })
          )
      )
    )
  );

  start$ = createEffect(() =>
    this.actions$.pipe(
      ofType<Login>(AppActionTypes.LOGIN),
      map((action) => action.payload),
      switchMap((payload) =>
        this.apiService
          .read(
            `${CONFIRMATION_URLs.login}?refid=${payload.refId}&usercode=${payload.userCode}`
          )
          .pipe(
            map((data: IApiResult) => {
              if (data.success && data.results) {
                this.modalService.close();
                this.store.dispatch(
                  new LoadTransactions({
                    refId: payload.refId,
                    userCode: payload.userCode,
                  })
                );
                return new LoginSuccess(<any[]>data.results);
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: data.errorMessage
                    ? data.errorMessage
                    : 'Something went wrong. Form data could not be loaded.',
                  icon: 'error',
                  confirmButtonText: 'Close',
                });
                return new LoginSuccess([]);
              }
            }),
            catchError(() => EMPTY)
          )
      )
    )
  );

  resend$ = createEffect(() =>
    this.actions$.pipe(
      ofType<Resend>(AppActionTypes.RESEND),
      map((action) => action.payload),
      switchMap((payload) =>
        this.apiService
          .read(`${CONFIRMATION_URLs.resendCode}?refid=${payload.refId}`)
          .pipe(
            map((data: IApiResult) => {
              if (data.success && data.results) {
                return new ResendSuccess(
                  <any>'Code has been sent. Please check your mail'
                );
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: data.errorMessage
                    ? data.errorMessage
                    : 'Something went wrong. Form data could not be loaded.',
                  icon: 'error',
                  confirmButtonText: 'Close',
                });
                return new LoginSuccess([]);
              }
            }),
            catchError(() => EMPTY)
          )
      )
    )
  );

  saveForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType<SaveForm>(AppActionTypes.SAVE_FORM),
      map((action) => action.payload),
      switchMap((payload) =>
        this.apiService
          .update(
            `${CONFIRMATION_URLs.update}/${payload.recordId}?refid=${payload.refId}&userCode=${payload.userCode}`,
            payload.data
          )
          .pipe(
            map((data: IApiResult) => {
              if (data.success) {
                this.store.dispatch(new SavingForm(false));
                Swal.fire({
                  title: 'Success!',
                  text: 'Your data was updated successfully',
                  icon: 'success',
                  confirmButtonText: 'Okay',
                });
                return new SaveFormSuccess(<any>data.success);
              } else {
                this.store.dispatch(new SavingForm(false));
                Swal.fire({
                  title: 'Error!',
                  text: data.errorMessage
                    ? data.errorMessage
                    : 'Something went wrong. Form data could not be loaded.',
                  icon: 'error',
                  confirmButtonText: 'Close',
                });
                return new SaveFormSuccess(false);
              }
            }),
            catchError(() => {
              this.store.dispatch(new SavingForm(false));
              return EMPTY;
            })
          )
      )
    )
  );

  completeProcess$ = createEffect(() =>
    this.actions$.pipe(
      ofType<CompleteProcess>(AppActionTypes.COMPLETE_PROCESS),
      map((action) => action.payload),
      switchMap((payload) =>
        this.apiService
          .update(
            `${CONFIRMATION_URLs.complete}/${payload.recordId}/${payload.masterId}?refid=${payload.refId}&userCode=${payload.userCode}`,
            payload.data
          )
          .pipe(
            map((data: IApiResult) => {
              if (data.success) {
                this.store.dispatch(new CompletingProcess(false));
                Swal.fire({
                  title: 'Success!',
                  text: 'Your data was updated successfully',
                  icon: 'success',
                  confirmButtonText: 'Okay',
                });
                return new CompleteProcessSuccess(<any>data.success);
              } else {
                this.store.dispatch(new CompletingProcess(false));
                Swal.fire({
                  title: 'Error!',
                  text: data.errorMessage
                    ? data.errorMessage
                    : 'Something went wrong. Form data could not be loaded.',
                  icon: 'error',
                  confirmButtonText: 'Close',
                });
                return new CompleteProcessSuccess(false);
              }
            }),
            catchError(() => {
              this.store.dispatch(new CompletingProcess(false));
              this.store.dispatch(new CompleteProcessSuccess(false));
              return EMPTY;
            })
          )
      )
    )
  );
}
