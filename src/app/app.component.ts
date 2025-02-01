import { Component } from '@angular/core';

import { PoMenuItem, poThemeDefaultActions, poThemeDefaultFeedback, poThemeDefaultLightValues, poThemeDefaultNeutrals, PoThemeService, PoThemeTypeEnum } from '@po-ui/ng-components';
import { poThemeSample } from './po-theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(poThemeService: PoThemeService) {
    poThemeService.setTheme(poThemeSample, 0);
  }

}
