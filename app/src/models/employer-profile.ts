export class EmployerProfile {

    businessName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    preferredContactOption: string;
    alternateContactOption: string;
    offices: any[] = [];
    specializations: any[] = [];
    otherSpecialization: string;
    areasToStaff: any[] = [];
    otherAreasToStaff: any[] = [];
    schedule: any = {
        mondayStart: '00:00',
        mondayEnd: '00:00',
        tuesdayStart: '00:00',
        tuesdayEnd: '00:00',
        wednesdayStart: '00:00',
        wednesdayEnd: '00:00',
        thursdayStart: '00:00',
        thursdayEnd: '00:00',
        fridayStart: '00:00',
        fridayEnd: '00:00',
        saturdayStart: '00:00',
        saturdayEnd: '00:00',
        sundayStart: '00:00',
        sundayEnd: '00:00',
    };
    officeManagers: any[] = [];
    officeCultureDescription: string;
    photos: any[] = [];
    profileQuestionAnswers: any[] = [];
    employeeOrganization: any = {
        root: {
            title: '',
            number: 0,
            children: []
        }
    };

    constructor() {}

}
