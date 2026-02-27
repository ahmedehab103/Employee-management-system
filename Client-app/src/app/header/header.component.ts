import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from '../../Modules/Common/domain/servies/localization-service';
import { LanguageType } from '../../Modules/Common/domain/language';
import { Button } from 'primeng/button';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [TranslateModule, Button],
})
export class HeaderComponent implements OnInit {
  @Output() toggleDrawer = new EventEmitter<void>();

  private readonly _localizationService: LocalizationService =
    inject(LocalizationService);

  private readonly _translationService: TranslationService =
    inject(TranslationService);

  constructor() {}

  ngOnInit() {}

  changLang() {
    let lang = this._localizationService.getCurrentLang();

    const newLang =
      lang?.lang == LanguageType.en ? LanguageType.ar : LanguageType.en;

    this._translationService.switchLanguage(newLang);
  }

  openSideName() {
    this.toggleDrawer.emit();
  }
}
