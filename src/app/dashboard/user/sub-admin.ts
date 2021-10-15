export class SubAdmin {
    firstName: string;
    lastName: string;
    email: string;
    mongodbConnectionUrl:string;
    domainName:string;
    logo:string;
    favicon:string;
    loginPageLogo:string;
    homePageLeafletText:string;
    coinNameOnWallet:string;
    nameOfTheAccount:string;
    address:string;
    website:string;
    contactNumber:string;

    constructor(firstName: string,
        lastName: string,
        email: string,
        mongodbConnectionUrl:string,
        domainName:string,
        logo:string,
        favicon:string,
        loginPageLogo:string,
        homePageLeafletText:string,
        coinNameOnWallet:string,
        nameOfTheAccount:string,
        address:string,
        website:string,
        contactNumber:string
        ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mongodbConnectionUrl = mongodbConnectionUrl;
        this.domainName = domainName;
        this.logo = logo;
        this.favicon = favicon;
        this.loginPageLogo = loginPageLogo;
        this.homePageLeafletText = homePageLeafletText;
        this.coinNameOnWallet = coinNameOnWallet;
        this.nameOfTheAccount = nameOfTheAccount;
        this.address = address;
        this.website = website;
        this.contactNumber = contactNumber;
    }
}