import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { RoutesEnum } from '../../routes.enum';

@Component({
    selector: 'app-main-navigation',
    templateUrl: './main-navigation.component.html',
    styleUrls: ['./main-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavigationComponent {
    @Input() public photoUrl!: string;

    @Output() public logOut: EventEmitter<void> = new EventEmitter<void>();

    public readonly routesEnum: typeof RoutesEnum = RoutesEnum;

    public logOutAction(event: MouseEvent): void {
        event.preventDefault();

        event.stopPropagation();

        this.logOut.emit();
    }
}
