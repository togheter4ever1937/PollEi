import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  constructor(private http: HttpClient) {}

  // Method to create a poll
  createPoll(title: string, question: string, start_at: string, end_time: string): Observable<any> {
    console.log('Inside createPoll method'); // Debugging line to check if this is called
    return this.http.post('http://localhost:3000/api/createPoll', {
      title,
      question,
      start_at,
      end_time,
    }).pipe(
      catchError(error => {
        console.error('Error in createPoll:', error);
        return throwError(error); // Ensure errors are handled properly
      })
    );
  }
  
  

  // Method to add options to a poll
  addOptions(pollID: number, options: string[]): Observable<any> {
    return this.http.post('http://localhost:3000/api/addOptions', {
      pollID,
      options,
    });
  }
}
