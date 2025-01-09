import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NavigationbarComponent } from '../../navigationbar/navigationbar.component';
import { HttpClient } from '@angular/common/http';
import { PollService } from '../../../services/Poll/poll.service';
import { AuthService } from '../../../services/Auth/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-poll',
  imports: [CommonModule, ReactiveFormsModule, NavigationbarComponent],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {
  user: any;
  createPollForm: FormGroup;
  addOptionsForm: FormGroup;
  isPollCreated: boolean = false;
  createdPollID: number | null = null; 
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private pollService: PollService,
    private http: HttpClient,
    private authService: AuthService
  ) {
 
    this.createPollForm = this.fb.group({
      pollName: ['', Validators.required],
      question: ['', Validators.required],
      start_at: ['', Validators.required],
      end_time: ['', Validators.required],
    });

    
    this.addOptionsForm = this.fb.group({
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  
  get options(): FormArray {
    return this.addOptionsForm.get('options') as FormArray;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.user = data;
      },
      (error: any) => {
        console.error(error);
        this.errorMessage = 'Failed to fetch user information.';
      }
    );
  }

  async submitPoll(): Promise<void> {
    if (this.createPollForm.invalid) {
      this.errorMessage = 'Please fill out all required fields in the poll form.';
      return;
    }
    if (this.createPollForm.valid) {
      const { pollName, question, start_at, end_time } = this.createPollForm.value;
  
      
      const startTime = new Date(start_at);
      const endTime = new Date(end_time);
      const now = new Date();
  
      
      if (startTime < now) {
        this.errorMessage = 'Start time must be greater than or equal to the current time.';
        console.error(this.errorMessage);
        return;
      }
  
      
      const diffInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60); 
      if (diffInMinutes < 30) {
        this.errorMessage = 'End time must be at least 30 minutes after the start time.';
        console.error(this.errorMessage);
        return;
      }
  
      console.log('Creating poll:', { pollName, question, start_at, end_time });
  
      this.isPollCreated = true;
      this.errorMessage = '';
  
      try {
        const pollResponse: any = await this.createPoll(pollName, question, start_at, end_time);
        console.log('Poll created response:', pollResponse);
  
        if (pollResponse && pollResponse.poll && pollResponse.poll.pollID) {
          this.createdPollID = pollResponse.poll.pollID;
          console.log('Poll ID:', this.createdPollID);
  
          const { title, question, start_at, end_time } = pollResponse.poll;
          console.log('Poll details:', { title, question, start_at, end_time });
          console.log('Poll created successfully, now waiting for options...');
        } else {
          console.error('Poll creation failed, invalid response:', pollResponse);
        }
      } catch (error) {
        console.error('Error creating poll:', error);
        this.errorMessage = 'Failed to create poll. Please try again.';
      }
    }
  }
  
  

  
  createPoll(pollName: string, question: string, start_at: string, end_time: string): Promise<any> {
    const pollData = {
      title: pollName,
      question: question,
      start_at: start_at,
      end_time: end_time
    };

    return this.http.post<any>('http://localhost:3000/api/createPoll', pollData).toPromise();
  }

  addOptions(pollID: number, options: string[]): Promise<any> {
    const optionsData = {
      pollID: pollID,
      options: options
    };

    return this.http.post<any>('http://localhost:3000/api/addOptions', optionsData).toPromise();
  }

  addOption(): void {
    const option = this.fb.control('', Validators.required);
    this.options.push(option);
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }


  async submitOptions(): Promise<void> {
    if (this.addOptionsForm.invalid || this.options.controls.some(control => control.invalid)) {
      this.errorMessage = 'Please fill out all required fields for options.';
      return;
    }

    

    this.errorMessage = '';
    if (this.addOptionsForm.valid && this.createdPollID) {
      const optionsList = this.options.value;  
      console.log('Options entered:', optionsList);

      const uniqueOptions = new Set(optionsList.map((option: string) => option.toLowerCase()));
      if (uniqueOptions.size !== optionsList.length) {
        this.errorMessage = 'Duplicate options are not allowed.';
        return;
      }

      if (optionsList.length < 2 || optionsList.length > 10) {
        this.errorMessage = 'The options list must contain between 2 and 10 options.';
        return;
      }
  
      if (optionsList.length > 0) {
        try {
         
          const optionsResponse: any = await this.addOptions(this.createdPollID, optionsList);
          console.log('Options added response:', optionsResponse);
  
          
          if (optionsResponse && optionsResponse.message === 'Options added successfully!') {
            console.log('Options added successfully:', optionsResponse);
            
            
            console.log('Poll updated with new options');
          } else {
            console.error('Failed to add options, invalid response:', optionsResponse);
            this.errorMessage = 'Failed to add options. Please try again.';
          }
        } catch (error) {
          console.error('Error adding options:', error);
          this.errorMessage = 'Error adding options. Please try again.';
        }
      } else {
        this.errorMessage = 'Please add at least one option before submitting.';
      }
    }
  }
  
  
}
