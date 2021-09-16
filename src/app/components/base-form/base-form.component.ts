import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IErrorMessage } from 'src/app/interfaces/error-message.interface';

@Component({
  template: ``,
})
export class BaseFormComponent {
  constructor() {}

  public markFormAsTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  public validate(
    form: FormGroup,
    validationMessages: any,
    checkDirty?: boolean
  ) {
    let errorMessages: IErrorMessage[] = [];
    let fieldValidationMessages: string[];

    for (const field in form.controls) {
      if (form.controls.hasOwnProperty(field)) {
        const control = form.get(field);

        if (control && control.invalid) {
          if (!checkDirty || control.dirty || control.touched) {
            fieldValidationMessages = [];
            const fieldMessages = validationMessages[field];

            for (const key in control.errors) {
              if (key) {
                const errorMessage = fieldMessages
                  ? fieldMessages[key]
                    ? fieldMessages[key]
                    : 'Error occured.'
                  : 'Error occured.';
                fieldValidationMessages.push(errorMessage);
              }
            }

            if (fieldValidationMessages.length > 0) {
              const payload: IErrorMessage = {
                title: fieldMessages ? fieldMessages.fieldTitle : field,
                messages: fieldValidationMessages,
              };
              errorMessages.push(payload);
            }
          }
        }
      }
    }

    fieldValidationMessages = [];
    const fieldMessages = validationMessages['flx'];

    for (const key in form.errors) {
      if (key) {
        const errorMessage = fieldMessages
          ? fieldMessages[key]
            ? fieldMessages[key]
            : 'Error occured.'
          : 'Error occured.';
        fieldValidationMessages.push(errorMessage);
      }
    }

    if (fieldValidationMessages.length > 0) {
      const payload: IErrorMessage = {
        title: fieldMessages ? fieldMessages.fieldTitle : 'Other Errors',
        messages: fieldValidationMessages,
      };
      errorMessages.push(payload);
    }

    return errorMessages;
  }

  public markFormGroupAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
