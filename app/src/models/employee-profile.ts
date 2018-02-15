export class EmployeeProfile {

    username: string;
    dateOfBirth: Date;
    employeeLocation: any = {
        locality: '',
        postalCode: '',
        state: '',
    };
    availability: any = {
        mondayStart: '00:00',
        mondayEnd: '00:00',
        mondayAvailabilityType: '',
        tuesdayStart: '00:00',
        tuesdayEnd: '00:00',
        tuesdayAvailabilityType: '',
        wednesdayStart: '00:00',
        wednesdayEnd: '00:00',
        wednesdayAvailabilityType: '',
        thursdayStart: '00:00',
        thursdayEnd: '00:00',
        thursdayAvailabilityType: '',
        fridayStart: '00:00',
        fridayEnd: '00:00',
        fridayAvailabilityType: '',
        saturdayStart: '00:00',
        saturdayEnd: '00:00',
        saturdayAvailabilityType: '',
        sundayStart: '00:00',
        sundayEnd: '00:00',
        sundayAvailabilityType: '',
    };
    employementHistory: any[] = [];
    endorsement: any[] = [];
    yearsOfExperience: number = 0;
    educationHistory: any[] = [];
    potentialEmployeeLocations: any[] = [];
    aboutMe: string;
    status: string;
    occupation: any;
    profileQuestionAnswers: any[] = [];
    photos: any[] = [];

    constructor() {}

}
