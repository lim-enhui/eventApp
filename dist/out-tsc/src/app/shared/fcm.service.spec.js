import { TestBed } from '@angular/core/testing';
import { FcmService } from './fcm.service';
describe('FcmService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(FcmService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=fcm.service.spec.js.map