import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
      private apiUrl = `${environment.apiUrl}/auth/team`;
  
  constructor(private http: HttpClient) { }

  // Team methods
  createTeam(team: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, team);
  }

  updateTeam(id: number, team: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, team);
  }

  getTeams(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getTeamById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/findbyid/${id}`);
  }

  getTeamByLeaderId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/leader/${id}`);
  }

  getTeamMembersByTeam(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/members`);
  }
}
