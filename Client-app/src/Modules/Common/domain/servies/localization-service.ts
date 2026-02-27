import { Injectable } from '@angular/core';
import { direction, Language, LanguageType } from '../language';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private readonly _langKey = 'CurrentLang';

  public supportedLangs(): Language[] {
    return [
      new Language(
        'en',
        LanguageType.en,
        'English',
        direction.ltr,
        './assets/icons/english.svg',
        true
      ),
      new Language(
        'ar',
        LanguageType.ar,
        'العربية',
        direction.rtl,
        './assets/icons/arabic.svg',
        false
      ),
    ];
  }

  public getCurrentLang(): Language | undefined {
    let lang = localStorage.getItem(this._langKey);

    if (!lang) {
      const defaultLang = this.supportedLangs().find((c) => c.isDefault);

      if (!defaultLang) throw new Error('Default language can not be null');

      this.setLanguage(defaultLang);

      lang = defaultLang.getString()!;
    }

    return this.supportedLangs().find((c) => c.getString() == lang);
  }

  private setLanguage(language: Language) {
    localStorage.setItem(this._langKey, language.getString()!);
  }

  public setLang(languageType: LanguageType): Language {
    const lang = this.supportedLangs().find((c) => c.lang == languageType);

    if (!lang) throw new Error('No language with this value');

    this.setLanguage(lang);

    return lang;
  }
}
