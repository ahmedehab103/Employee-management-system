import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../Modules/Common/domain/servies/localization-service';
import {
  direction,
  Language,
  LanguageType,
} from '../../Modules/Common/domain/language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  // private readonly _translateService: TranslateService =
  //   Inject(TranslateService);

  private readonly _localizationService: LocalizationService =
    inject(LocalizationService);

  constructor(private readonly _translateService: TranslateService) {
    const languages: Language[] = this._localizationService.supportedLangs();

    this._translateService.addLangs(languages.map((c) => c.getString()!));

    const lang = this._localizationService.getCurrentLang();
    console.log('📢[translation.service.ts:26]: lang: ', lang);

    if (!lang)
      throw new Error('Make sure ther at lest one language as default');

    this._translateService.setDefaultLang(lang.getString()!);

    this.setLang(lang);
  }

  public switchLanguage(language: LanguageType): void {
    const lang = this._localizationService.setLang(language);

    window.location.reload();
    this.setLang(lang);
  }

  private setLang(language: Language) {
    this._translateService.use(language.getString()!);
    this.updateLayout(language);
  }

  private updateLayout(language: Language): void {
    document.documentElement.lang = language.getString()!;

    switch (language.direction) {
      case direction.ltr:
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl-layout');
        break;
      case direction.rtl:
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl-layout');
        break;
    }
  }
}
