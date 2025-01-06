import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NavigationbarComponent } from '../../navigationbar/navigationbar.component';
import { PollService } from '../../../services/Poll/poll.service';  // Assuming this path
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
  isPollCreated: boolean = false;  // Initially false
  errorMessage: string = '';  // To store any error messages

  constructor(
    private pollService: PollService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.createPollForm = this.fb.group({
      pollName: ['', Validators.required],
      question: ['', Validators.required],
      start_at: ['', Validators.required],
      end_time: ['', Validators.required],
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  // Getter for options form array
  get options(): FormArray {
    return this.createPollForm.get('options') as FormArray;
  }

  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.user = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  addOption(): void {
    const option = this.fb.control('');
    this.options.push(option);
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  submitForm(): void {
    if (this.createPollForm.valid) {
      const { pollName, question, start_at, end_time, options } = this.createPollForm.value;

      // Prepare poll data for backend submission
      const optionsList = options.map((option: string) => option);

      // Call the PollService to create the poll
      this.pollService.createPoll(pollName, question, start_at, end_time).subscribe(
        (response: any) => {
          // If poll creation is successful
          this.isPollCreated = true;
          this.errorMessage = ''; // Clear any previous errors
          console.log('Poll created successfully:', response);
          // After successful creation, add options if there are any
          if (optionsList.length > 0) {
            this.addOptionsToPoll(response.pollID, optionsList);
          }
        },
        (error: any) => {
          // Handle any errors from backend
          console.error('Poll creation failed:', error);
          this.isPollCreated = false;
          this.errorMessage = 'Failed to create poll. Please try again.';
        }
      );
    }
  }

  // Method to add options to the poll after it's created
  addOptionsToPoll(pollID: number, options: string[]): void {
    this.pollService.addOptions(pollID, options).subscribe(
      (response: any) => {
        console.log('Options added successfully:', response);
      },
      (error: any) => {
        console.error('Failed to add options:', error);
      }
    );
  }
}
