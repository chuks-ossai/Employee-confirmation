export interface IAppState {
  transactions: any[];
  employeeDetails: any;
  login: any;
  resend: any;
  loading: boolean;
  savingForm: boolean;
  saveFormSuccess: boolean;
  completingProcess: boolean;
  completeProcessSuccess: boolean;
}

export const initialAppState: IAppState = {
  transactions: [],
  employeeDetails: null,
  login: null,
  resend: null,
  loading: false,
  savingForm: false,
  saveFormSuccess: false,
  completingProcess: false,
  completeProcessSuccess: false,
};
