import { TestBed } from '@angular/core/testing';

import { NativeHelpersService } from './native-helpers.service';

describe('NativeHelpersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeHelpersService = TestBed.get(NativeHelpersService);
    expect(service).toBeTruthy();
  });
});
