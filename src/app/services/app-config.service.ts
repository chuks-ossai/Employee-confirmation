import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

import { IAppConfig, IPackageFile } from '../models';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private http: HttpClient;

  config: IAppConfig | undefined;
  packageFile: IPackageFile | undefined;

  constructor(handler: HttpBackend, private apiService: ApiService) {
    this.http = new HttpClient(handler);
  }

  load() {
    const file = `assets/config/app-config.json`;

    return new Promise<void>((resolve, reject) => {
      this.http
        .get<IAppConfig>(file)
        .toPromise()
        .then((response: IAppConfig) => {
          this.config = <IAppConfig>response;

          if (this.config && this.config.data) {
            this.apiService.apiBaseURL = this.config.data.api;
          }

          this.apiService.version = environment.version;

          resolve();
        })
        .catch((response: any) => {
          reject(`Could not load config file: ${JSON.stringify(response)}`);
        });
    });
  }

  loadPackage() {
    const file = `package.json`;

    return new Promise<void>((resolve, reject) => {
      this.http
        .get<IPackageFile>(file)
        .toPromise()
        .then((response: IPackageFile) => {
          this.packageFile = <IPackageFile>response;

          if (this.packageFile) {
            this.apiService.version = this.packageFile.version;
          }

          resolve();
        })
        .catch((response: any) => {
          reject(`Could not load package file: ${JSON.stringify(response)}`);
        });
    });
  }
}
