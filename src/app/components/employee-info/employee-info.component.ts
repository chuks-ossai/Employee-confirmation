import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
})
export class EmployeeInfoComponent implements OnInit {
  @Input() data: any;
  @Input() loading: boolean;
  @Input() profileImage: any;
  @Input() disableSubmit: boolean;
  @Input() isBusy: boolean;

  @Output() submitClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    this.submitClick.emit();
  }
}
