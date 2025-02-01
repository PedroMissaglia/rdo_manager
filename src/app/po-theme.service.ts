import { poThemeDefaultActions, poThemeDefaultFeedback, poThemeDefaultLightValues, poThemeDefaultNeutrals, PoThemeTypeEnum } from "@po-ui/ng-components";

export const poThemeSample = {
  name: 'po-theme',
  type: {
    light: {
      color: {
        brand: {
          '01': {
            lightest: '#F5F7F9',
            lighter: '#4F789D',
            light: '#2E5F8B',
            base: '#265680',
            dark: '#194368',
            darker: '#0F304E',
            darkest: '#0A2640'
          },
          '02': {
            base: '#265680'
          },
          '03': {
            base: '#265680'
          }
        },
        action: {
          ...poThemeDefaultActions,
          disabled: 'var(--color-neutral-mid-40)'
        },
        feedback: {
          ...poThemeDefaultFeedback,
          info: {
            ...poThemeDefaultFeedback.info,
            base: '#265680'
          }
        },
        neutral: {
          ...poThemeDefaultNeutrals
        }
      },
      onRoot: {
        ...poThemeDefaultLightValues.onRoot,
        '--color-page-background-color-page': 'var(--color-neutral-light-05)'
      },
      perComponent: {
        ...poThemeDefaultLightValues.perComponent
      }
    },

  },
  active: PoThemeTypeEnum.light
};
