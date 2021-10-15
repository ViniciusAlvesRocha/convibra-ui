export class Issuer{
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    personalAddress: string;
    // company specific fields
    officeMobileNumber: string;
    companyName: string;
    companyAddress: string;
    designation: string;
    constructor(
        firstName: string,
        lastName: string,
        email: string,
        mobileNumber: string,
        officeMobileNumber: string,
        personalAddress: string,
        companyName: string,
        companyAddress: string,
        designation: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.officeMobileNumber = officeMobileNumber;
        this.personalAddress = personalAddress;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.designation = designation;
    }
}