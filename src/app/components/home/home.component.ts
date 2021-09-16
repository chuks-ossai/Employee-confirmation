import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  IProcessMetaData,
  IProcessTransactionDetail,
  IProcessTransactionMaster,
} from 'src/app/interfaces/process-transaction-detail.interface';
import {
  CompleteProcess,
  CompletingProcess,
  SaveForm,
  SavingForm,
} from 'src/app/store/app.action';
import { IAppState } from 'src/app/store/app.state';
import { FormRendererComponent } from '../form-renderer/form-renderer.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnChanges {
  @Input() transactions: any;
  @Input() showRenderer!: boolean; // displays the renderer for the user to complete his or her process
  @Input() loading!: boolean;
  @Input() currentDetailRowData!: IProcessTransactionDetail;
  @Input() currentDetailRowIndex: number = 0;
  @Input() rendererJson!: string; //the placeholder for the form json for each process at a time
  @Input() refId!: string; //the placeholder for the form json for each process at a time
  @Input() userCode!: string; //the placeholder for the form json for each process at a time

  @ViewChild('renderer') renderer!: FormRendererComponent;
  masterForm!: FormGroup;
  detailRow!: IProcessTransactionDetail;
  currentMasterData!: IProcessTransactionMaster;
  userMetaData$!: Observable<IProcessMetaData>;
  userMetaData!: IProcessMetaData;
  masterData$!: Observable<IProcessTransactionMaster>;
  detailData$!: Observable<IProcessTransactionDetail[]>;
  isProcessingMaster$!: Observable<boolean>;
  isProcessingDetail$!: Observable<boolean>;
  isSaving$!: Observable<boolean>;
  isCompleting$!: Observable<boolean>;
  isSubmitting$!: Observable<boolean>;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private store: Store<IAppState>
  ) {
    this.masterForm = this.fb.group({
      detailsForm: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions']) {
      if (this.transactions.length) {
        this.transactions.forEach((row) => this.addDetail(row));
      }
    }
  }

  ngOnInit(): void {}

  setDetail(data: IProcessTransactionDetail): FormGroup {
    return this.fb.group({
      id: data.id,
      form_id: data.form_id,
      rank: data.form_rank,
      form_json: data.form_json,
      form_data: data.form_data,
      form_data_json: data.form_data_json,
      form_comment: data.form_comment,
      doc_binary: data.doc_binary,
      doc_guid: data.doc_guid,
      doc_url: data.doc_url,
      doc_filename: data.doc_filename,
      doc_ext: data.doc_ext,
      doc_extention: data.doc_extention,
      doc_mime: data.doc_mime,
      doc_size: data.doc_size,
      is_complete: data.is_complete,
      role: data.role,
      completed_by: data.ext_user_email,
      form_title: data.form_title, // used strictly to get title & description of form
      form_description: data.form_description, // used strictly to get title & description of form
      role_perm: data.role_perm, // used strictly test if user has access to form
    });
  }

  get detailsform(): FormArray {
    return this.masterForm.get('detailsForm') as FormArray;
  }

  addDetail(data: IProcessTransactionDetail) {
    this.detailsform.push(this.setDetail(data));
  }

  removeDetail(i: number) {
    this.detailsform.removeAt(i);
  }

  onShowRenderer(event: { index: number; detail: IProcessTransactionDetail }) {
    this.showRenderer = false;
    // this.onRendererCancel();
    this.currentDetailRowIndex = event.index; // i is  the index of the selection on the details form array
    this.currentDetailRowData = event.detail; // currently selected detail data
    this.renderer.header = {
      title: event.detail.form_title,
      subTitle: event.detail.form_description,
    };
    this.rendererJson = event.detail.form_json;
    this.renderer.initBuilderData(this.rendererJson);
    this.cd.markForCheck();
    this.showRenderer = true;
  }

  transformDetailsBody(
    data: IProcessTransactionDetail
  ): IProcessTransactionDetail {
    console.table(data);
    return {
      completed_by: data.ext_user_email,
      form_id: data.form_id,
      rank: data.form_rank,
      form_json: data.form_json,
      form_data_json: data.form_data_json,
      form_comment: data.form_comment,
      doc_binary: data.doc_binary,
      doc_guid: data.doc_guid,
      doc_url: data.doc_url,
      doc_filename: data.doc_filename,
      doc_ext: data.doc_ext,
      doc_extention: data.doc_extention,
      doc_mime: data.doc_mime,
      doc_size: data.doc_size ? data.doc_size : 0,
      // is_complete: data.is_complete === PROCESS_FORM_COMPLETE.YES,
      is_complete: !!+data.is_complete,
    };
  }

  onRendererComplete($event: { [s: string]: unknown } | ArrayLike<unknown>) {
    const entries = Object.entries($event);
    const form_json = JSON.parse(this.rendererJson);
    for (const key of entries) {
      form_json.forEach((record: { field_name: string; value: unknown }) => {
        if (record.field_name === key[0]) {
          record.value = key[1];
        }
      });
    }
    this.detailsform.value[this.currentDetailRowIndex].form_json =
      JSON.stringify(form_json);
    let detailFormValue: IProcessTransactionDetail =
      this.detailsform.value[this.currentDetailRowIndex];

    this.store.dispatch(new CompletingProcess(true));
    this.store.dispatch(
      new CompleteProcess({
        data: this.transformDetailsBody(detailFormValue),
        recordId: this.currentDetailRowData.id,
        masterId: this.currentDetailRowData.portal_master_id,
        userCode: this.userCode,
        refId: this.refId,
      })
    );
  }

  onRendererSave($event: ArrayLike<unknown> | { [s: string]: unknown }) {
    const entries = Object.entries($event);
    const form_json = JSON.parse(this.rendererJson);

    for (const key of entries) {
      form_json.forEach((record: { field_name: string; value: unknown }) => {
        if (record.field_name === key[0]) {
          record.value = key[1];
        }
      });
    }

    this.detailsform.value[this.currentDetailRowIndex].form_json =
      JSON.stringify(form_json);
    let detailFormValue: IProcessTransactionDetail =
      this.detailsform.value[this.currentDetailRowIndex];
    this.store.dispatch(new SavingForm(true));
    this.store.dispatch(
      new SaveForm({
        data: this.transformDetailsBody(detailFormValue),
        recordId: detailFormValue.id,
        masterId: this.currentDetailRowData.master_id,
        editMode: true,
        refId: this.refId,
        userCode: this.userCode,
      })
    );
    // this.onRendererCancel();
  }

  onSubmitMastersButtonClicked(recordId: number) {
    // this.store.dispatch(new SubmittingProcessFormWizard());
    //     this.store.dispatch(new SubmitProcessFormWizard({ recordId: this.userMetaData.masterId, role: this.userMetaData.roleId, employeeId: this.userMetaData.employeeId, flag: this.userMetaData.flag}));
  }

  onRendererCancel() {
    this.showRenderer = false;
  }
}
