export class Signup {
    accountType:string;
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

    password: string;
    confirmPassword: string;
    accountID:string;
    checked:boolean;
    constructor(
        accountType:string,
        firstName: string,
        lastName: string,
        email: string,
        mobileNumber: string,
        officeMobileNumber: string,
        personalAddress: string,
        companyName: string,
        companyAddress: string,
        designation: string,
        password: string,
        confirmPassword: string,
        accountID:string,
        checked:boolean) {
        this.accountType = accountType;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.officeMobileNumber = officeMobileNumber;
        this.personalAddress = personalAddress;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.designation = designation;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.accountID = accountID;
        this.checked = checked;
    }
}