import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() closeOnOutsideClick: boolean = true;
  @Input() showCloseIcon: boolean = true;
  @Input() processingStart: boolean = false;
  @Input() processingResend: boolean = false;
  @Input() errorMsg: string = '';
  @Input() successMsg: string = '';
  code: string = '';
  display$: Observable<'open' | 'close'>;

  lightMode: boolean = false;

  @Output() onResend = new EventEmitter();
  @Output() onStart = new EventEmitter();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.display$ = this.modalService.watch();
  }

  switchViewMode() {
    this.lightMode = !this.lightMode;
  }

  close() {
    this.modalService.close();
  }

  onResendCode() {
    this.onResend.emit(this.code);
  }

  onStartForm() {
    this.onStart.emit(this.code);
  }
}
