import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AppConfigService } from './services/app-config.service';
import { CardComponent } from './components/card/card.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FormioModule } from 'angular-formio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseFormComponent } from './components/base-form/base-form.component';
import { FormRendererComponent } from './components/form-renderer/form-renderer.component';
import { FilePickerDirective } from './directives/file-picker.directive';
import { ModalComponent } from './components/modal/modal.component';
import { ButtonComponent } from './components/button/button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { InterceptorService } from './services/interceptor.service';
import { EmployeeInfoComponent } from './components/employee-info/employee-info.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './store/app.effects';
import { appReducer } from './store/app.reducer';

export function initializeAppConfig(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardComponent,
    DateFormatPipe,
    BaseFormComponent,
    FormRendererComponent,
    FilePickerDirective,
    ModalComponent,
    ButtonComponent,
    SpinnerComponent,
    EmployeeInfoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormioModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    StoreModule.forRoot({ app: appReducer }, {}),
    EffectsModule.forRoot([AppEffects]),
    NgxShimmerLoadingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppConfig,
      deps: [AppConfigService],
      multi: true,
    },
    { provide: 'partialDocumentTitle', useValue: ` | ${environment.appName}` },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
