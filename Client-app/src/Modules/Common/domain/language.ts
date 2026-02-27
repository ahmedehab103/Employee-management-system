export enum LanguageType {
  en,
  ar,
}
export enum direction {
  rtl,
  ltr,
}

export class Language {
  name: string | null | undefined;
  lang: LanguageType | null | undefined;
  title: string | null | undefined;
  direction: direction | null | undefined;
  icon: string | null | undefined;
  isDefault?: boolean = false;
  /**
   *
   */
  constructor(
    name: string,
    lang: LanguageType,
    title: string,
    direction: direction,
    icon: string,
    isDefault: boolean
  ) {
    this.name = name;
    this.lang = lang;
    this.title = title;
    this.direction = direction;
    this.icon = icon;
    this.isDefault = isDefault;
  }
  public getString(): string | null {
    return this.name!;
  }
}
