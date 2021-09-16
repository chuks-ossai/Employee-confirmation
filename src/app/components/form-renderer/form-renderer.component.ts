import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  Renderer2,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { FormRendererService } from './form-renderer.service';
import { Observable } from 'rxjs/internal/Observable';
import { widgetType } from 'src/app/constants/dynamic-form.constant';
import { BaseFormComponent } from '../base-form/base-form.component';
import { IBasicData } from 'src/app/interfaces/basic-data.interface';
import { IFormBuilder } from 'src/app/interfaces/form-builder';
import { UtilService } from 'src/app/services/util.service';
import { FilePickerDirective } from 'src/app/directives/file-picker.directive';

export interface IRendererHeader {
  title: string;
  subTitle: string;
}

@Component({
  selector: 'app-form-renderer',
  templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.scss'],
  providers: [FormRendererService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRendererComponent
  extends BaseFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public show!: boolean;
  @Input() public width!: number;
  @Input() public header: IRendererHeader | undefined;
  @Input() public data!: string;
  @Input() public isBusy!: boolean | null;
  @Input() public readonly!: boolean;
  @Input() public isAccessible: boolean = true;
  @Input() public disableSubmit: boolean = false;
  @Input() public disableSave: boolean = false;

  @Input() public isSecondaryBusy!: boolean | null;
  @Input() public showSave!: boolean;
  @Input() public showSubmit!: boolean;
  @Input() public submitText!: string;
  @Input() public loading!: boolean;

  @Output() formSave = new EventEmitter<any>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancelClick = new EventEmitter<any>();

  transformedData!: IFormBuilder[];
  isProcessing$!: Observable<boolean>;
  dataSetTypes$!: Observable<IBasicData[]>;
  formWidgetType = widgetType;
  submitted = false;
  selectedFiles: any;

  @ViewChild('dropZonePicker', { static: true })
  dropZonePicker!: FilePickerDirective;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      this.initBuilderData(this.data);
      this.submitted = false;
    }
  }

  constructor(
    public utilService: UtilService,
    public fs: FormRendererService,
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit() {}

  getStyles(): any {
    if (this.header.subTitle !== '') {
      return {
        'padding-top': '2.3em',
      };
    } else {
      return {
        'padding-top': '2.5em',
      };
    }
  }

  initBuilderData(data: string) {
    if (data) {
      try {
        /* Checks if user can view form */
        if (!this.isAccessible) {
          this.showSave = false;
          this.showSubmit = false;
        } else {
          this.transformedData = <IFormBuilder[]>JSON.parse(data);
          this.fs.init(this.transformedData);
          /* Checks if form is disabled by the host component to make it read only */
          if (this.readonly) {
            this.fs.f.disable();
            this.showSave = false;
            this.showSubmit = false;
          } else {
            this.showSave = true;
            this.showSubmit = true;
          }
        }
      } catch (e) {
        console.log('Invalid Json Type', 'should be shown in a toastr');
      }
    }
  }

  inEditMode(): boolean {
    if (this.data) {
      return true;
    } else {
      return false;
    }
  }

  onCancel() {
    // this.data = null;
    // this.reset();
    this.cancelClick.emit();
  }

  onFilesChanged($event: any, controlName: any) {
    this.fs.f.get(controlName)!.setValue($event);
  }

  onReset() {
    this.selectedFiles = null;
  }

  resetFilePicker() {
    this.dropZonePicker.reset();
  }

  regexEventHandler(event: KeyboardEvent, inputPattern: string | RegExp) {
    const pattern = new RegExp(inputPattern, 'i');
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  regexPasteEventHandler(event: { preventDefault: () => void }) {
    event.preventDefault();
  }

  onSubmit() {
    this.submitted = true;
    if (this.fs.f.invalid) {
      return;
    }
    this.formSubmit.emit(this.fs.value);
  }

  onSave() {
    this.submitted = true;
    if (this.fs.f.invalid) {
      return;
    }
    this.formSave.emit(this.fs.value);
  }

  toJson(value: string): any {
    if (value) {
      let result = null;
      try {
        result = JSON.parse(value);
      } catch (e) {
        console.log(e);
      }
      return result;
    }
  }

  getErrorMessage() {
    return this.utilService.errorHtmlString(
      this.validate(this.fs.f, this.fs.validationMessages)
    );
  }

  reset() {
    this.fs.f.reset();
    this.fs.destroy();
  }

  downloadFile(data: { value: any }) {
    if (data.value) {
      let docProp = data.value;

      let link = document.createElement('a');
      link.download = `${docProp.name}`;
      let blob = this.converBase64toBlob(docProp.content, docProp.mimeType);
      // let blob = new Blob([docProp.content], {type: docProp.mimeType});
      link.href = URL.createObjectURL(blob);
      window.open(link.href);
      // link.click();
      // URL.revokeObjectURL(link.href);
    } else {
      console.log('No file was uploaded error', 'should be shown in a toastr');
    }
  }

  converBase64toBlob(content: string, contentType: string) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content); //method which converts base64 to binary
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
      type: contentType,
    }); //statement which creates the blob
    return blob;
  }

  ngOnDestroy() {}
}
