import { NavigationBarModel } from '@models';

import { RoutesEnum } from '../src/app/routes.enum';

export const navigationBarConfig: NavigationBarModel[] = [
  {
    mainRoute: RoutesEnum.main,
    subRoutesMenu: [
      {
        name: 'Огляд',
        url: RoutesEnum.mainOverview
      },
      {
        name: 'Документація',
        url: RoutesEnum.mainDocumentation
      },
      {
        name: 'Енергоспоживання',
        url: null!
      },
      {
        name: 'Договори енергопостачання',
        url: RoutesEnum.mainSupplyContracts
      },
      {
        name: 'Тарифи на енергоносії',
        url: RoutesEnum.mainTariffs
      },
      {
        name: 'Графічні карти інженерних мереж',
        url: null!
      },
      {
        name: 'Інтерактивна карта',
        url: null!
      },
      {
        name: 'Плани заходів з енергозбереження',
        url: null!
      }
    ]
  },
  {
    mainRoute: RoutesEnum.manage,
    subRoutesMenu: [
      {
        name: 'Місця',
        url: RoutesEnum.manageLocations
      },
      {
        name: 'Будівлі',
        subMenu: [
          {
            name: 'Типи будівель',
            url: RoutesEnum.manageBuildingType
          },
          {
            name: 'Будівлі',
            url: RoutesEnum.manageBuildings
          },
          {
            name: 'Поверхи',
            url: RoutesEnum.manageFloors
          },
          {
            name: 'Кімнати',
            url: RoutesEnum.manageRooms
          }
        ]
      },
      {
        name: 'Лічильники',
        url: RoutesEnum.manageMeters
      },
      {
        name: 'Користувачі',
        subMenu: [
          {
            name: 'Користувачі',
            url: RoutesEnum.manageUsers
          },
          {
            name: 'Запрошення',
            url: RoutesEnum.manageInvitedUsers
          },
          {
            name: 'Групи',
            url: RoutesEnum.manageGroups
          }
        ]
      }
    ]
  },
  {
    mainRoute: RoutesEnum.user,
    subRoutesMenu: [
      {
        name: 'Профіль',
        url: RoutesEnum.userProfile
      },
      {
        name: 'Групи',
        url: null!
      },
      {
        name: 'Безпека',
        url: RoutesEnum.userSecurity
      },
      {
        name: 'Історія дій',
        url: null!
      },
      {
        name: 'Додатково',
        url: RoutesEnum.userAdditional
      }
    ]
  }
];
