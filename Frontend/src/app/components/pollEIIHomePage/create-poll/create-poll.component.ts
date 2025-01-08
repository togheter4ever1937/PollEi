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
  createdPollID: number | null = null; // Store created poll ID
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private pollService: PollService,
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Initialize the create poll form
    this.createPollForm = this.fb.group({
      pollName: ['', Validators.required],
      question: ['', Validators.required],
      start_at: ['', Validators.required],
      end_time: ['', Validators.required],
    });

    // Initialize the add options form
    this.addOptionsForm = this.fb.group({
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  // Getter for options array
  get options(): FormArray {
    return this.addOptionsForm.get('options') as FormArray;
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
    if (this.createPollForm.valid) {
      const { pollName, question, start_at, end_time } = this.createPollForm.value;
      console.log('Creating poll:', { pollName, question, start_at, end_time });
  
      this.isPollCreated = true;
  
      try {
        // Manually create poll request using HttpClient
        const pollResponse: any = await this.createPoll(pollName, question, start_at, end_time);
        console.log('Poll created response:', pollResponse);
  
        // Check if the poll was created and contains the pollID
        if (pollResponse && pollResponse.poll && pollResponse.poll.pollID) {
          this.createdPollID = pollResponse.poll.pollID;
          console.log('Poll ID:', this.createdPollID);
  
          // Access the other poll properties for reuse (e.g., title, question, etc.)
          const { title, question, start_at, end_time } = pollResponse.poll;
          console.log('Poll details:', { title, question, start_at, end_time });
  
          // Now you can use this data for adding options or other actions
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
  

  // Manual HTTP call for creating the poll
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

  // Submit options after the poll is created and the options are filled out
  async submitOptions(): Promise<void> {
    if (this.addOptionsForm.valid && this.createdPollID) {
      const optionsList = this.options.value;  // Get the options entered by the user
      console.log('Options entered:', optionsList);
  
      if (optionsList.length > 0) {
        try {
          // Call the API to add options, passing pollID and the list of options
          const optionsResponse: any = await this.addOptions(this.createdPollID, optionsList);
          console.log('Options added response:', optionsResponse);
  
          // Check if the options were added successfully
          if (optionsResponse && optionsResponse.message === 'Options added successfully!') {
            console.log('Options added successfully:', optionsResponse);
            
            // You can use the response (e.g., updated poll data or confirmation)
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
