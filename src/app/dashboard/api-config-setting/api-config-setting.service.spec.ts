import { TestBed } from '@angular/core/testing';

import { ApiConfigSettingService } from './api-config-setting.service';

describe('ApiConfigSettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiConfigSettingService = TestBed.get(ApiConfigSettingService);
    expect(service).toBeTruthy();
  });
});
