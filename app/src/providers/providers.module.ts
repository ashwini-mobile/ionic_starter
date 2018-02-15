import { NgModule } from '@angular/core';

// API providers
import { Oauth } from '../providers/utilities/api/oauth';
import { AuthToken } from '../providers/utilities/api/auth-token';
import { HttpErrorHandler } from '../providers/utilities/api/http-error-handler';
import { ApiGateway } from '../providers/utilities/api/api-gateway';
import { UserProvider } from './user-provider';
import { SecurityProvider } from './security-provider';
// Utility providers
import { Settings } from '../providers/utilities/app-settings';
import { Config } from '../providers/utilities/app-configuration';
import { Utilities } from '../providers/utilities/app-utilities';
import { StorageProvider } from '../providers/utilities/storage-provider';
import { CacheRequest } from '../providers/utilities/cache-request';
import { DataSvcProvider } from '../providers/data-svc/data-svc';
import { LookupProvider } from './lookup-provider';
import { EmployerProfileProvider } from './employer-profile-provider';
import { EmployeeProfileProvider } from './employee-profile-provider';
import { EmployerSearchFilterProvider } from './employer-search-filter-provider';
import { EmployeeSearchFilterProvider } from './employee-search-filter-provider';
import { LikeDislikeProvider } from './like-dislike-provider';
import { MatchProvider } from './match-provider';
import { MessageProvider } from './message-provider';
import { FriendshipProvider } from './friendship-provider';
import { InterviewProvider } from './interview-provider';
import { BenchMatchProvider } from './bench-match-provider';
import { EmployerBenchProvider } from './employer-bench-provider';
import { EmployeeBenchProvider } from './employee-bench-provider';
import { ContactUsProvider } from './contact-us-provider';
import { HelpProvider } from './help-provider';
import { SuggestionProvider } from './suggestion-provider';
import { SubscriptionProvider } from './subscription-provider';
import { LocationService } from './location-service';
export function httpErrorHandler(httpErrorHandler: HttpErrorHandler): any {
	return (): any => {};
}

@NgModule({
	providers: [
		// API providers
		Oauth,
		AuthToken,
		HttpErrorHandler,
		ApiGateway,
		SecurityProvider,
        UserProvider,
		LookupProvider,
		EmployerProfileProvider,
        EmployeeProfileProvider,
		EmployerSearchFilterProvider,
		EmployeeSearchFilterProvider,
		LikeDislikeProvider,
		MatchProvider,
		MessageProvider,
		FriendshipProvider,
        InterviewProvider,
        BenchMatchProvider,
        EmployerBenchProvider,
        EmployeeBenchProvider,
		ContactUsProvider,
		HelpProvider,
		SuggestionProvider,
		// Utility providers
		Settings,
		Config,
		Utilities,
		StorageProvider,
		CacheRequest,
		DataSvcProvider,
		SubscriptionProvider,
		LocationService
	]
})
export class ProvidersModule {}
