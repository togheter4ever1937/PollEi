import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  constructor(private http: HttpClient) {}

  // Method to create a poll
  createPoll(title: string, question: string, start_at: string, end_time: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/createPoll', {
      title,
      question,
      start_at,
      end_time,
    });
  }

  // Method to add options to a poll
  addOptions(pollID: number, options: string[]): Observable<any> {
    return this.http.post('http://localhost:3000/api/addOptions', {
      pollID,
      options,
    });
  }
}
