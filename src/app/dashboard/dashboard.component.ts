import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service';
import { AuthenticationService } from '../common/authentication.service';
import { AlertService } from '../common/alert.service';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './user/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from "sweetalert2";

declare var $: any, c3: any, Aero: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    userData;
    instanceSettingObj: any = {
        logo: null,
        orgName: null,
        domainName: null,
        credentials: {
            uniblockUIGateway: null,
            apiSecret:null
        }
    };

    uniblockMainsLink = "";

    constructor(private authService: AuthenticationService,
        private alertService: AlertService,
        private ngxService: NgxUiLoaderService,
        private commonService: CommonService,
        private router: Router,
        private userService: UserService) {


    }

    subAccountList: any;
    subAccountID: any;
    subAccountLoadState: string;
    activeUser: any;

    ngOnInit() {

        this.subAccountLoadState = "Loading";
        this.activeUser = this.authService.getCurrentAuthData();

        if (this.activeUser == null) {
            Swal.fire({
                icon: 'error',
                text: 'Currently, you are not logged in. Please login to system.',
                confirmButtonText: 'Ok'
            }).then(() => this.router.navigateByUrl('login'));

            return;
        }

        this.loadAccount();
        this.getInstanceSetting();
    }

    getInstanceSetting() {
        let paramData = ["general"];
        this.commonService.getInstanceSetting(paramData).subscribe(success => {

            this.instanceSettingObj.logo = '/api/v1/common/file/' + success['data'].general.logo;
            this.instanceSettingObj.orgName = success['data'].general.organizationName;
            this.instanceSettingObj.domainName = success['data'].general.domainName;

            if(success['data'].credentials != undefined)
            {
                this.instanceSettingObj.credentials = success['data'].credentials
                /* Build Mains Link */
                this.uniblockMainsLink = this.instanceSettingObj.credentials.uniblockUIGateway + '/login/authorize/'+ this.instanceSettingObj.credentials.apiSecret
            }
            
            // this.commonService.setTitle(this.instanceSettingObj.domainName + ": Dashboard");

        }, error => {
            this.alertService.showError(error.message);
        })
    }

    loadAccount() {
        this.userService.getSubAccountAdminList(1, -1, {}).subscribe(success => {
            //this.ngxService.stop();
            this.subAccountList = success['data']['userData'];
            setTimeout(function () {
                $("select#subAccountID").selectpicker("refresh");
            }, 1000);

            this.subAccountLoadState = "Select User";
        }, error => {
            this.alertService.showError(error.message);
        });
    }

    setCurrentAccount() {

        let _previousAuth = this.authService.getCurrentAuthData();
        this.authService.loginById(this.subAccountID).subscribe(success => {

            /*  Switch Account while maintaining previous session */
            let _finalAuthData = success['data'];
            _finalAuthData['previousAuth'] = {}
            _finalAuthData['previousAuth'] = _previousAuth;

            this.authService.setCurrentAuthData(success['data']);
            this.ngxService.start();

            // this.router.navigate(['/dashboard']);
            location.reload();

        }, error => {
            this.alertService.showError(error.message);
        })
    }

    switchToPreviousAccount() {
        this.ngxService.start();
        let _currentAuth = this.authService.getCurrentAuthData();
        if (_currentAuth['previousAuth'] != undefined) {
            this.authService.setCurrentAuthData(_currentAuth['previousAuth']);
            // this.router.navigate(['/dashboard']);
            location.reload();
        }
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/']);
    }

    getRole(role) {
        var result;
        switch (role) {
            case 'ROLE_ACCOUNT_ADMIN': result = 'Account Admin'
                break;
            case 'ROLE_SUB_ACCOUNT_ADMIN': result = 'Sub Account Admin'
                break;
            case 'ROLE_ISSUER': result = 'Certificate Issuer'
                break;
            case 'ROLE_RECIPIENT': result = 'Certificate Recipient'
                break;
            case 'ROLE_VERIFIER': result = 'Certificate Verifier'
                break;
            default: result = 'UNKNOWN'
                break;
        }
        return result;
    }

    toggleCss() {
        // toogle is not working
        if (document.body.classList.contains('ls-toggle-menu')) {

            document.body.classList.remove('ls-toggle-menu')
        } else {
            document.body.classList.add('ls-toggle-menu')
        }
    }

    aeroThemeInitialization() {
        $(function () {
            "use strict";
            initSparkline();
            initC3Chart();
        });

        function initSparkline() {
            $(".sparkline").each(function () {
                var $this = $(this);
                $this.sparkline('html', $this.data());
            });
        }
        function initC3Chart() {
            setTimeout(() => {
                $(document).ready(function () {
                    var chart = c3.generate({
                        bindto: '#chart-area-spline-sracked', // id of chart wrapper
                        data: {
                            columns: [
                                // each columns data
                                ['data1', 21, 8, 32, 18, 19, 17, 23, 12, 25, 37],
                                ['data2', 7, 11, 5, 7, 9, 16, 15, 23, 14, 55],
                                ['data3', 13, 7, 9, 15, 9, 31, 8, 27, 42, 18],
                            ],
                            type: 'area-spline', // default type of chart
                            groups: [
                                ['data1', 'data2', 'data3']
                            ],
                            colors: {
                                'data1': Aero.colors["gray"],
                                'data2': Aero.colors["teal"],
                                'data3': Aero.colors["lime"],
                            },
                            names: {
                                // name of each serie
                                'data1': 'Revenue',
                                'data2': 'Returns',
                                'data3': 'Queries',
                            }
                        },
                        axis: {
                            x: {
                                type: 'category',
                                // name of each category
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct']
                            },
                        },
                        legend: {
                            show: true, //hide legend
                        },
                        padding: {
                            bottom: 0,
                            top: 0,
                        },
                    });
                });
                $(document).ready(function () {
                    var chart = c3.generate({
                        bindto: '#chart-pie', // id of chart wrapper
                        data: {
                            columns: [
                                // each columns data
                                ['data1', 55],
                                ['data2', 25],
                                ['data3', 20],
                            ],
                            type: 'pie', // default type of chart
                            colors: {
                                'data1': Aero.colors["lime"],
                                'data2': Aero.colors["teal"],
                                'data3': Aero.colors["gray"],
                            },
                            names: {
                                // name of each serie
                                'data1': 'Arizona',
                                'data2': 'Florida',
                                'data3': 'Texas',
                            }
                        },
                        axis: {
                        },
                        legend: {
                            show: true, //hide legend
                        },
                        padding: {
                            bottom: 0,
                            top: 0
                        },
                    });
                });
                $(document).ready(function () {
                    var chart = c3.generate({
                        bindto: '#chart-area-step', // id of chart wrapper
                        data: {
                            columns: [
                                // each columns data
                                ['data1', 11, 8, 15, 7, 11, 13],
                                ['data2', 7, 7, 5, 7, 9, 12]
                            ],
                            type: 'area-step', // default type of chart
                            colors: {
                                'data1': Aero.colors["pink"],
                                'data2': Aero.colors["orange"]
                            },
                            names: {
                                // name of each serie
                                'data1': 'Today',
                                'data2': 'month'
                            }
                        },
                        axis: {
                            x: {
                                type: 'category',
                                // name of each category
                                categories: ['1', '2', '3', '4', '5', '6']
                            },
                        },
                        legend: {
                            show: true, //hide legend
                        },
                        padding: {
                            bottom: 0,
                            top: 0
                        },
                    });
                });
            }, 500);
        }
        setTimeout(() => {
            "use strict";
            var mapData = {
                "US": 298,
                "SA": 200,
                "AU": 760,
                "IN": 2000000,
                "GB": 120,
            };
            if ($('#world-map-markers').length > 0) {
                $('#world-map-markers').vectorMap({
                    map: 'world_mill_en',
                    backgroundColor: 'transparent',
                    borderColor: '#fff',
                    borderOpacity: 0.25,
                    borderWidth: 0,
                    color: '#e6e6e6',
                    regionStyle: {
                        initial: {
                            fill: '#f4f4f4'
                        }
                    },

                    markerStyle: {
                        initial: {
                            r: 5,
                            'fill': '#fff',
                            'fill-opacity': 1,
                            'stroke': '#000',
                            'stroke-width': 1,
                            'stroke-opacity': 0.4
                        },
                    },

                    markers: [{
                        latLng: [21.00, 78.00],
                        name: 'INDIA : 350'

                    },
                    {
                        latLng: [-33.00, 151.00],
                        name: 'Australia : 250'

                    },
                    {
                        latLng: [36.77, -119.41],
                        name: 'USA : 250'

                    },
                    {
                        latLng: [55.37, -3.41],
                        name: 'UK   : 250'

                    },
                    {
                        latLng: [25.20, 55.27],
                        name: 'UAE : 250'

                    }],

                    series: {
                        regions: [{
                            values: {
                                "US": '#49c5b6',
                                "SA": '#667add',
                                "AU": '#50d38a',
                                "IN": '#60bafd',
                                "GB": '#ff758e',
                            },
                            attribute: 'fill'
                        }]
                    },
                    hoverOpacity: null,
                    normalizeFunction: 'linear',
                    zoomOnScroll: false,
                    scaleColors: ['#000000', '#000000'],
                    selectedColor: '#000000',
                    selectedRegions: [],
                    enableZoom: false,
                    hoverColor: '#fff',
                });
            }
        }, 800);
    }

}
