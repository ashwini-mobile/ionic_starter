import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { ComponentButtonToolbar } from './button-toolbar/button-toolbar';
import { ComponentFormControlMessage } from './form-control-message/form-control-message';
import { ComponentHorizontalOverflowContainer } from './horizontal-overflow-container/horizontal-overflow-container';
import { ComponentLogoHeader } from './logo-header/logo-header';
import { ComponentNumberInput } from './number-input/number-input';
import { ComponentPasswordViewer } from './password-viewer/password-viewer';
import { ComponentScrollShadow } from './scroll-shadow/scroll-shadow';
import { ComponentSelectSwitch } from './select-switch/select-switch';
import { SlickCarouselComponent, SlickCarouselItem } from './slick-carousel/slick-carousel';
import { ComponentOffice } from './office/office.component';
import { SearchFilterComponent } from './search-filter/search-filter';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { MessageScreenComponent } from './message-screen/message-screen';

@NgModule({
	declarations: [
		ComponentButtonToolbar,
		ComponentFormControlMessage,
		ComponentHorizontalOverflowContainer,
		ComponentLogoHeader,
		ComponentNumberInput,
		ComponentPasswordViewer,
		ComponentScrollShadow,
		ComponentSelectSwitch,
		SlickCarouselComponent,
		SlickCarouselItem,
		ComponentOffice,
		SearchFilterComponent,
		Login,
		Signup,
    	MessageScreenComponent
	],
	imports: [
		IonicModule
	],
	exports: [
		ComponentButtonToolbar,
		ComponentFormControlMessage,
		ComponentHorizontalOverflowContainer,
		ComponentLogoHeader,
		ComponentNumberInput,
		ComponentPasswordViewer,
		ComponentScrollShadow,
		ComponentSelectSwitch,
		SlickCarouselComponent,
		SlickCarouselItem,
		ComponentOffice,
		SearchFilterComponent,
		Login,
		Signup,
    	MessageScreenComponent
	]
})
export class ComponentsModule {}
