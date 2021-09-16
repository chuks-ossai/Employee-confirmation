import { AppActions, AppActionTypes } from './app.action';
import { IAppState, initialAppState } from './app.state';

export function appReducer(
  state = initialAppState,
  action: AppActions
): IAppState {
  switch (action.type) {
    case AppActionTypes.LOAD_TRANSACTIONS_SUCCESS:
      return { ...state, transactions: action.payload };
    case AppActionTypes.LOAD_EMPLOYEE_DETAILS:
      return { ...state, employeeDetails: action.payload };
    case AppActionTypes.LOGIN_SUCCESS:
      return { ...state, login: action.payload };
    case AppActionTypes.RESEND_SUCCESS:
      return { ...state, resend: action.payload };
    case AppActionTypes.LOADING:
      return { ...state, loading: action.payload };
    case AppActionTypes.SAVING_FORM:
      return { ...state, savingForm: action.payload };
    case AppActionTypes.SAVE_FORM_SUCCESS:
      return { ...state, saveFormSuccess: action.payload };
    case AppActionTypes.COMPLETING_PROCESS:
      return { ...state, completingProcess: action.payload };
    case AppActionTypes.COMPLETE_PROCESS_SUCCESS:
      return { ...state, completeProcessSuccess: action.payload };
    default: {
      return state;
    }
  }
}
