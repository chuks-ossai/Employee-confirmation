import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState } from './app.state';

// export const getState = (state: IAppState) => state;
export const getState = createFeatureSelector<IAppState>('app');

export const getTransactions = createSelector(
  getState,
  (state: IAppState) => state.transactions
);

export const getEmployeeDetail = createSelector(
  getState,
  (state: IAppState) => state.employeeDetails
);

export const getLoggedInDetail = createSelector(
  getState,
  (state: IAppState) => state.login
);

export const getResentDetail = createSelector(
  getState,
  (state: IAppState) => state.resend
);

export const loadingTransactions = createSelector(
  getState,
  (state: IAppState) => state.loading
);

export const isSavingForm = createSelector(
  getState,
  (state: IAppState) => state.savingForm
);

export const saveFormSuccess = createSelector(
  getState,
  (state: IAppState) => state.saveFormSuccess
);

export const isCompletingProcess = createSelector(
  getState,
  (state: IAppState) => state.completingProcess
);

export const completeProcessSuccess = createSelector(
  getState,
  (state: IAppState) => state.completeProcessSuccess
);
