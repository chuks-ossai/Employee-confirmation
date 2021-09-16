import { Action } from '@ngrx/store';

export enum AppActionTypes {
  LOADING = '[CONFIRMATION TRANSACTIONS] Loading',
  LOADING_AWAITING = '[CONFIRMATION TRANSACTIONS] Loading Awaiting',

  LOAD_TRANSACTIONS = '[CONFIRMATION TRANSACTIONS] Load Transactions',
  LOAD_TRANSACTIONS_SUCCESS = '[CONFIRMATION TRANSACTIONS] Load Transactions Success',
  LOAD_EMPLOYEE_DETAILS = '[CONFIRMATION TRANSACTIONS] Load Employee Details',

  LOGIN = '[CONFIRMATION TRANSACTIONS] Login',
  LOGIN_SUCCESS = '[CONFIRMATION TRANSACTIONS] Login Success',

  RESEND = '[CONFIRMATION TRANSACTIONS] Resend',
  RESEND_SUCCESS = '[CONFIRMATION TRANSACTIONS] Resend Success',

  SAVING_FORM = '[CONFIRMATION TRANSACTIONS] Saving Form',
  SAVE_FORM = '[CONFIRMATION TRANSACTIONS] Save form',
  SAVE_FORM_SUCCESS = '[CONFIRMATION TRANSACTIONS] Save Form Success',

  COMPLETING_PROCESS = '[CONFIRMATION TRANSACTIONS] Completing Process',
  COMPLETE_PROCESS = '[CONFIRMATION TRANSACTIONS] Complete Process',
  COMPLETE_PROCESS_SUCCESS = '[CONFIRMATION TRANSACTIONS] Complete Process Success',
}

export class LoadTransactions implements Action {
  readonly type = AppActionTypes.LOAD_TRANSACTIONS;
  constructor(public payload: { refId: string; userCode: string }) {}
}

export class LoadTransactionsSuccess implements Action {
  readonly type = AppActionTypes.LOAD_TRANSACTIONS_SUCCESS;
  constructor(public payload: any[]) {}
}

export class LoadEmployeeDetail implements Action {
  readonly type = AppActionTypes.LOAD_EMPLOYEE_DETAILS;
  constructor(public payload: any) {}
}

export class Login implements Action {
  readonly type = AppActionTypes.LOGIN;
  constructor(public payload: { refId: string; userCode: string }) {}
}

export class LoginSuccess implements Action {
  readonly type = AppActionTypes.LOGIN_SUCCESS;
  constructor(public payload: any[]) {}
}

export class Resend implements Action {
  readonly type = AppActionTypes.RESEND;
  constructor(public payload: { refId: string }) {}
}

export class ResendSuccess implements Action {
  readonly type = AppActionTypes.RESEND_SUCCESS;
  constructor(public payload: any[]) {}
}
export class LoadingTransactions implements Action {
  readonly type = AppActionTypes.LOADING;
  constructor(public payload: boolean) {}
}
export class SavingForm implements Action {
  readonly type = AppActionTypes.SAVING_FORM;
  constructor(public payload: boolean) {}
}
export class SaveFormSuccess implements Action {
  readonly type = AppActionTypes.SAVE_FORM_SUCCESS;
  constructor(public payload: boolean) {}
}

export class SaveForm implements Action {
  readonly type = AppActionTypes.SAVE_FORM;

  constructor(
    public payload: {
      data: any;
      recordId: number;
      editMode: boolean;
      masterId?: number;
      refId: string;
      userCode: string;
    }
  ) {}
}
export class CompletingProcess implements Action {
  readonly type = AppActionTypes.COMPLETING_PROCESS;
  constructor(public payload: boolean) {}
}
export class CompleteProcessSuccess implements Action {
  readonly type = AppActionTypes.COMPLETE_PROCESS_SUCCESS;
  constructor(public payload: boolean) {}
}

export class CompleteProcess implements Action {
  readonly type = AppActionTypes.COMPLETE_PROCESS;

  constructor(
    public payload: {
      data: any;
      recordId: number;
      masterId?: number;
      refId: string;
      userCode: string;
    }
  ) {}
}

export type AppActions =
  | LoadTransactions
  | LoadTransactionsSuccess
  | Login
  | LoginSuccess
  | Resend
  | ResendSuccess
  | LoadingTransactions
  | SavingForm
  | SaveForm
  | SaveFormSuccess
  | CompleteProcess
  | CompletingProcess
  | CompleteProcessSuccess
  | LoadEmployeeDetail;
