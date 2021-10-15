import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class SharedService {

    change: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() { }
}