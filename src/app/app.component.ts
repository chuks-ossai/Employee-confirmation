import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormRendererService } from './components/form-renderer/form-renderer.service';
import { HomeComponent } from './components/home/home.component';
import { ModalService } from './components/modal.service';
import { IProcessTransactionDetail } from './interfaces/process-transaction-detail.interface';
import { LoadingTransactions, Login, Resend } from './store/app.action';
import {
  getEmployeeDetail,
  getLoggedInDetail,
  getResentDetail,
  getTransactions,
  loadingTransactions,
} from './store/app.selector';
import { IAppState } from './store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [FormRendererService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public transactions$: Observable<any>;
  public loggedInData$: Observable<any>;
  public resentData$: Observable<any>;
  public employeeDetail$: Observable<any>;
  public loadingTransactions$: Observable<boolean>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public showRenderer!: boolean;
  public currentDetailRowData!: IProcessTransactionDetail;
  public currentDetailRowIndex: number = 0;
  public rendererJson!: string;
  public refId: string;
  public errorMsg: string;
  public userCode: string;

  @ViewChild('home') home!: HomeComponent;

  constructor(
    private modalService: ModalService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fs: FormRendererService,
    private store: Store<IAppState>
  ) {
    this.route.queryParams.subscribe((queryparams: Params) => {
      this.refId = queryparams.refid;
    });
  }

  ngOnInit() {
    this.modalService.open();
    this.storeSelects();
    this.store.dispatch(new LoadingTransactions(true));
    this.showFirstRenderer();
  }

  storeSelects() {
    this.transactions$ = this.store.select(pipe(getTransactions));
    this.employeeDetail$ = this.store.select(pipe(getEmployeeDetail));
    this.loggedInData$ = this.store.select(pipe(getLoggedInDetail));
    this.resentData$ = this.store.select(pipe(getResentDetail));
    this.loadingTransactions$ = this.store.select(pipe(loadingTransactions));
  }

  open() {
    this.modalService.open();
  }

  onSignOut() {
    this.modalService.open();
  }

  showFirstRenderer() {
    this.transactions$.pipe(takeUntil(this.destroy$)).subscribe((v) => {
      if (v && v.length) {
        this.destroy$.next(true);
        this.onShowRenderer({
          index: this.currentDetailRowIndex,
          detail: v[this.currentDetailRowIndex],
        });
      }
    });
  }

  onResend() {
    this.store.dispatch(new Resend({ refId: this.refId }));
  }

  onStart(evt: string) {
    this.userCode = evt;
    this.store.dispatch(new Login({ refId: this.refId, userCode: evt }));
  }

  onShowRenderer(event: { index: number; detail: IProcessTransactionDetail }) {
    this.showRenderer = false;
    this.currentDetailRowIndex = event.index; // i is  the index of the selection on the details form array
    this.currentDetailRowData = event.detail; // currently selected detail data
    this.home.renderer.header = {
      title: event.detail.form_title,
      subTitle: event.detail.form_description,
    };
    this.rendererJson = event.detail.form_json;
    this.home.renderer.readonly = !!+event.detail.is_complete;
    this.home.renderer.initBuilderData(this.rendererJson);
    this.cd.markForCheck();
    this.showRenderer = true;
  }

  onSubmit() {
    this.home.onRendererComplete(this.fs.value);
  }
}
