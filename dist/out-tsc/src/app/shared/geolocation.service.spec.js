import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';
describe('GeolocationService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(GeolocationService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=geolocation.service.spec.js.map