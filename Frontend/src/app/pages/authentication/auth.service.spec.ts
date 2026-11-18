import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  // Helper to create valid base64url mock JWT token
  function createMockJwt(payload: any): string {
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const encodedPayload = btoa(JSON.stringify(payload))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const fakeSignature = 'mockSignatureRS256';
    return `${header}.${encodedPayload}.${fakeSignature}`;
  }

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report isAuthenticated as false when no token is in localStorage', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getToken()).toBeNull();
  });

  it('should report isAuthenticated as true when a token is present', () => {
    localStorage.setItem('token', 'sample.jwt.token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getToken()).toBe('sample.jwt.token');
  });

  it('should safely store auth credentials in localStorage via storeAuthData', () => {
    const authData = {
      token: 'jwt.token.here',
      refreshToken: 'jwt.refresh.token',
      user: { id: 1, name: 'Alice Admin', email: 'alice@example.com', power: 'SuperAdmin' }
    };

    service.storeAuthData(authData);

    expect(localStorage.getItem('token')).toBe('jwt.token.here');
    expect(localStorage.getItem('refreshToken')).toBe('jwt.refresh.token');
    expect(service.getCurrentUser()).toEqual(authData.user);
  });

  it('should clear all credentials from localStorage via clearLocalStorage', () => {
    localStorage.setItem('token', 'tok123');
    localStorage.setItem('refreshToken', 'ref123');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    service.clearLocalStorage();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should decode RS256 token payload correctly using internal decodeJwt without external libraries', () => {
    const token = createMockJwt({
      id: 42,
      email: 'pilot@onboardaero.com',
      name: 'Captain Leeds',
      roleName: 'Operations Lead',
      power: 'OpsAdmin'
    });

    localStorage.setItem('token', token);

    const user = service.getUser();
    expect(user).toBeTruthy();
    expect(user.id).toBe(42);
    expect(user.name).toBe('Captain Leeds');
    expect(user.roleName).toBe('Operations Lead');
    expect(user.power).toBe('OpsAdmin');
  });

  it('should extract user power via getUserPower()', () => {
    localStorage.setItem('user', JSON.stringify({ id: 5, power: 'QualityAdmin' }));
    expect(service.getUserPower()).toBe('QualityAdmin');
  });

  it('should prioritize roleName from token over stored user in getRole()', () => {
    const token = createMockJwt({ roleName: 'TokenRole' });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ role: 'StoredRole' }));

    expect(service.getRole()).toBe('TokenRole');
  });

  it('should fallback to stored user role in getRole() if token role is absent', () => {
    localStorage.setItem('user', JSON.stringify({ role: 'FallbackRole' }));
    expect(service.getRole()).toBe('FallbackRole');
  });
});

