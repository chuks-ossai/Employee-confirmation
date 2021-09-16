export interface IProcessTransactionDetail {
  id?: number;
  master_id?: number;
  portal_master_id?: number;
  formInfo?: any;
  rank?: number;
  form_rank?: number;
  form_json: string;
  form_data?: string;
  form_data_json?: string;
  form_comment?: string;
  doc_binary?: string;
  doc_guid?: string;
  doc_url?: string;
  doc_filename?: string;
  doc_ext?: string;
  doc_extention?: string;
  doc_mime?: string;
  doc_size?: number;
  is_complete?: any;
  role?: number;
  username?: string;
  username_fullname?: string;
  complete_date?: Date;
  completed_by?: string;
  form_code?: string;
  form_description?: string;
  form_id?: number;
  ext_user_email?: string;
  form_title?: string;
  role_text?: string;
  role_perm?: number;
  role_perm_text?: string;
  is_owner?: boolean;
}

export interface IProcessTransactionMaster {
  id: number;
  master_id: number;
  process_id: number;
  process_id_text: string;
  employee_id: number;
  employee_name: string;
  username: string;
  is_complete: string;
  status: number;
  status_text: string;
  approval_status: number;
  role: number;
  transaction_date: Date;
}

export interface IProcessMetaData {
  employeeId: number;
  roleId: number;
  masterId: number;
  flag?: number;
}
