import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProcessTransactionDetail } from 'src/app/interfaces/process-transaction-detail.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() transactions: any;
  @Input() activeIndex: any;
  @Input() loading: any;
  @Output() onFormSelect = new EventEmitter<{
    index: number;
    detail: IProcessTransactionDetail;
  }>();

  selectedIndex: number;

  constructor() {}

  ngOnInit(): void {}

  onCardClick(detail: IProcessTransactionDetail, index: number) {
    this.selectedIndex = index;
    console.table({
      activeIndex: this.activeIndex,
      selectedIndex: this.selectedIndex,
    });
    this.onFormSelect.emit({ index, detail });
  }
}
