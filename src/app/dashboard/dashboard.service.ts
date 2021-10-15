import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { 

  }

  getDashboardDetails() {
    return this.http.get('/api/v1/common/get_dashboard_statistic');
  }

}
