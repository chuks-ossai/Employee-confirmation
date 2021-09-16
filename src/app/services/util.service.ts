import { Injectable } from '@angular/core';
import { IErrorMessage } from '../interfaces/error-message.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }


  public errorHtmlString(errorMessages: IErrorMessage[]): string {
    let htmlText = '';

    if (errorMessages && errorMessages.length > 0) {
      for (let i = 0; i < errorMessages.length; i++) {
        const errorMessage = errorMessages[i];

        htmlText =
          htmlText +
          `<div class="text-dark"><h6 class="mb-0 toast-header text-uppercase">${
            errorMessage.title
          }</h6><ul class="mb-3 toast-bullet">`;

        const messages = errorMessage.messages;
        for (let j = 0; j < messages.length; j++) {
          htmlText =
            htmlText +
            `<li><span class="toast-line-text"> ${messages[j]} </span></li>`;
        }

        htmlText = htmlText + `</ul></div>`;
      }
    }

    return htmlText;
  }

}
