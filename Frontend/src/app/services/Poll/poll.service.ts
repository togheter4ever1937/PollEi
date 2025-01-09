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
    console.log('Inside createPoll method');
    return this.http.post('http://localhost:3000/api/createPoll', {
      title,
      question,
      start_at,
      end_time,
    }).pipe(
      catchError(error => {
        console.error('Error in createPoll:', error);
        return throwError(error);
      })
    );
  }
  
  

  addOptions(pollID: number, options: string[]): Observable<any> {
    return this.http.post('http://localhost:3000/api/addOptions', {
      pollID,
      options,
    });
  }
  getActivePolls(): Observable<any> {
    return this.http.get('http://localhost:3000/api/activePolls').pipe(
      catchError((error) => {
        console.error('Error fetching active polls:', error);
        return throwError(error); // Handle errors properly
      })
    );
  }

  getEndedPolls(): Observable<any> {
    return this.http.get('http://localhost:3000/api/endedPolls').pipe(
      catchError((error) => {
        console.error('Error fetching ended polls:', error);
        return throwError(error);
      })
    );
  }

  getOptions(pollID: number): Observable<any> {
    return this.http.get(`http://localhost:3000/api/getOptions/${pollID}`).pipe(
      catchError((error) => {
        console.error('Error fetching poll options:', error);
        return throwError(error);
      })
    );
  }
}


