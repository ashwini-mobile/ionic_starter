import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Office } from '../../components/office/office';
import 'rxjs/add/operator/map';
import { Friend } from './friend';
import { Activity } from './activity';
import { Opportunity } from './opportunity';

/*
  Generated class for the DataSvcProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataSvcProvider {
	public data: any;
  constructor(public http: Http) {
    this.data = null;
  }
  load(): Promise<any> {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('assets/json/slider.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  loadHearAboutUs(): Promise<any> {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('assets/json/hear-about-us.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  //Load data on pratice profile
  loadPracticeBusinessName(): Promise<any> {
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('assets/json/practice-business-name.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeOffice(): Promise<any> {
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('assets/json/practice-office.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeBusiness(): Promise<any> {
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('assets/json/practice-business.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeOfficeStaff(): Promise<any> {
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('assets/json/practice-office-staffs.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticePreferred(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/practice-preferred.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeAlternate(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/practice-alternate.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  loadPracticeTime(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/practice-time.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeTypeOpen(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/practice-type-open.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeDate(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/practice-date-open.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeAccountSocial(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/practice-account-social.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  loadPracticeSocialPhotos(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/practice-social-photo.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  //================== Dashboard================
  // Friends
  loadFriendsEndorsement(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/friend-endorsement.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  // Friends
  loadFriendsList(): Promise<Friend[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/friend-list.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  //load Opportunities
  loadOpportunities(): Promise<Opportunity[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/opportunities.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  //get Profile Detail
  loadProfileDetail(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/profile-detail.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  //get Profile Detail Employee
  loadProfileDetailEmployee(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/profile-detail-employee.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  //benches
  loadDataBenches(): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/benches-data.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  //Offices
  loadDataOffices(): Promise<Office[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/offices.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as Office[]);
        });
    });
  }

  //search
  //filter
  loadDataFilterCategory(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/filter-category.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  //get data filter by category id
  loadDataByCategoryName(catID: number): Promise<any> {
    return new Promise(resolve => {
      this.http.get('assets/json/filters.json')
        .map(res => res.json())
        .subscribe(data => {
          for (let item of data) {
            if (item.id === catID){
              resolve(item);
            }
          }
        });
    });
  }

  //Load data Activity
  loadDataActivitys(): Promise<Activity[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/activitys.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }

  //Load data Activity
  loadSchool(): Promise<Activity[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/schools.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data.schools as any[]);
        });
    });
  }

  // get data chart
  loadDataChart(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/data-chart.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }

  // get data Popup Add SoftWares
  loadDataPopupSoftWares(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-softwares.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  loadDataPopupTechSkill(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-techskill.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  loadDataPopupOtherSoft(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-other-soft.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  loadDataPopupGeneralSkill(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-general-skill.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  loadDataPopupAdminSkill(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-admin-skill.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  loadDataPopupDentalPhil(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-dental-phil.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  loadDataPopupPosition(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-position.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data as any[]);
        });
    });
  }
  // get administrators
  getAdministrators(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/pop-administrators.json')
        .map(res => res.json())
        .subscribe(data => {
          resolve(data as any[]);
        });
    });
  }

  // get subcription variable Config
  getSubcriptionVariable(): Promise<boolean> {
    return new Promise(resolve => {
      this.http.get('assets/json/config.json')
        .map(res => res.json())
        .subscribe(data => {
          resolve(data.subcription);
        });
    });
  }
  // get subcriptions
  getSubcriptions(): Promise<any[]> {
    return new Promise(resolve => {
      this.http.get('assets/json/subcriptions.json')
        .map(res => res.json())
        .subscribe(data => {
          resolve(data as any[]);
        });
    });
  }
}
