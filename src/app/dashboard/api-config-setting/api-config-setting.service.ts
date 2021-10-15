import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ApiConfigSettingService {

	constructor(private http: HttpClient) { }

	getAPIConfigSettingDetails() {
		return this.http.get('/api/v1/api_config_setting/details');
	}

	updateAPIConfigSetting(frmData) {
		return this.http.post('/api/v1/api_config_setting/update', frmData);
	}
}
