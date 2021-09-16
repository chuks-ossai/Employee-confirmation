import {
  Directive,
  HostListener,
  Output,
  Input,
  SimpleChanges,
  EventEmitter,
  Optional,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FILE_EXTENSIONS } from '../constants/file-extentions.constant';

@Directive({
  selector: '[appFilePicker]',
  exportAs: 'appFilePicker',
})
export class FilePickerDirective {
  fileToUpload: any = [];
  @Input() public fileBlob: any;

  private _form!: HTMLFormElement;

  /**
   * Prevent dragover event so drop events register.
   **/
  @HostListener('dragover', ['$event'])
  _onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  /**
   * Set files on drop.
   * Emit selected files.
   **/
  @HostListener('drop', ['$event'])
  _drop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer!.files;
    this._nativeFileElement.files = files;
    this._onFilesChanged();
  }

  /**
   * Invoke file browse on click.
   **/
  @HostListener('click', ['$event'])
  _onClick(event: Event) {
    event.preventDefault();
    this._nativeFileElement.click();
  }

  /**
   * Allow multiple file selection. Defaults to `false`.
   * **/
  @Input()
  set multiple(val: boolean) {
    this._multiple = coerceBooleanProperty(val);
  }
  get multiple() {
    return this._multiple;
  }
  private _multiple = false;

  @Input()
  set name(val: string) {
    this._name = val;
  }
  get name() {
    return this._name;
  }
  private _name = '';

  /**
   * File list emitted on change.
   * **/
  @Output()
  filesChanged = new EventEmitter<IFileData>();

  /**
   * File list emitted on change.
   * **/
  @Output()
  filesReset = new EventEmitter();

  /**
   * Selected Files
   **/
  get files(): FileList | null {
    return this._nativeFileElement.files;
  }

  get nativeFileElement() {
    return this._nativeFileElement;
  }
  private _nativeFileElement!: HTMLInputElement;

  private getDataURLWithoutMimeType(value: string): any {
    const index = value.indexOf(',');
    return value.slice(index + 1);
  }

  convertStringToArray(value: string): string[] {
    const arr = [];

    for (let i = 0; i <= value.length; i++) {
      arr[i] = value.charAt(i);
    }

    return arr;
  }

  getFileExtension(fileName: string) {
    let index = 0;

    const indices = this.findAllOccurencesOfString(
      this.convertStringToArray(fileName),
      '.'
    );
    if (indices.length > 0) {
      index = indices[indices.length - 1];

      if (index === 0) {
        return 'UNKNOWN';
      } else {
        return fileName.substring(index + 1);
      }
    } else {
      return '';
    }
  }
  findAllOccurencesOfString(valueArr: string[], searchText: string) {
    const indices = [];
    let idx = valueArr.indexOf(searchText);
    while (idx !== -1) {
      indices.push(idx);
      idx = valueArr.indexOf(searchText, idx + 1);
    }

    return indices;
  }

  blobIsImage(blob: string) {
    if (blob) {
      const acceptedImageTypes = ['/', 'i', 'R'];
      const index = blob.charAt(0);
      return acceptedImageTypes.includes(index);
    }
    return false;
  }

  validateExtension(extension: string): boolean {
    return FILE_EXTENSIONS.includes(extension);
  }

  private _onFilesChanged = () => {
    this.fileToUpload = this._nativeFileElement.files;
    if (this.fileToUpload.length === 1) {
      const modRef = this;

      const reader: FileReader = new FileReader();

      reader.onload = () => {
        if (modRef.fileToUpload && modRef.fileToUpload.length === 1) {
          const value = {
            name: modRef.fileToUpload[0].name,
            content:
              modRef.getDataURLWithoutMimeType(<string>reader.result) || '',
            mimeType: modRef.fileToUpload[0].type || '',
            size: modRef.fileToUpload[0].size || 0,
            extension:
              modRef.getFileExtension(modRef.fileToUpload[0].name) || '',
            lastModifiedDate: modRef.fileToUpload[0].lastModifiedDate,
          };

          if (this.validateExtension(value.extension)) {
            modRef.filesChanged.emit(value);
            this.fileBlob = value.content;
          } else {
            this.reset();
            modRef.filesChanged.emit();
          }
        }
      };

      reader.readAsDataURL(this.fileToUpload[0]);
    }
  };

  constructor(@Optional() @Inject(DOCUMENT) private _document: Document) {
    if (this._document) {
      this._form = this._document.createElement('form');
      this._nativeFileElement = this._document.createElement('input');
      this._nativeFileElement.type = 'file';
      this._nativeFileElement.multiple = this.multiple;
      this._nativeFileElement.addEventListener('change', this._onFilesChanged);
      this._form.appendChild(this.nativeFileElement);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.multiple) {
      this._nativeFileElement.multiple = this.multiple;
    }
  }

  ngOnDestroy() {
    this._nativeFileElement.removeEventListener('change', this._onFilesChanged);
    this._nativeFileElement.remove();
    this._form.remove();
  }

  /**
   * Reset file list.
   **/
  reset() {
    this._form.reset();
    this.filesChanged.emit(undefined);
    this.filesReset.emit();
  }
}

export interface IFileData {
  name: string;
  content: null;
  mimeType: string;
  size: number;
  extension: string;
  lastModifiedDate: Date;
}
