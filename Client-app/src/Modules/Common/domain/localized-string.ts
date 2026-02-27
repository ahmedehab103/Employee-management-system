import { LocalizationService } from './servies/localization-service';
import { LanguageType } from './language';

export class LocalizedString {
  private static readonly _localizationService = new LocalizationService();

  constructor(ar: string, en: string) {
    this.ar = ar;
    this.en = en;
  }

  ar: string | null | undefined;
  en: string | null | undefined;

  public static getString(
    text?: LocalizedString | null
  ): string | null | undefined {
    const lang = this._localizationService.getCurrentLang();

    switch (lang?.lang) {
      case LanguageType.ar:
        return text?.ar;
      case LanguageType.en:
        return text?.en;
      default:
        return text?.en;
    }
  }
}
