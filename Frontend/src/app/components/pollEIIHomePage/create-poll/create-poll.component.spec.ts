import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PollService } from '../../../services/Poll/poll.service';  

@Component({
  selector: 'app-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css'],
})
export class PollComponent {
  createPollForm: FormGroup;
  isPollCreated: boolean = false;
  pollID: number | null = null;

  constructor(private fb: FormBuilder, private pollService: PollService) {
    // Initialize the form
    this.createPollForm = this.fb.group({
      title: ['', Validators.required],
      question: ['', Validators.required],
      start_at: ['', Validators.required],
      end_time: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required) // At least one option
      ])
    });
  }

  // Getter for options FormArray
  get options(): FormArray {
    return this.createPollForm.get('options') as FormArray;
  }

  // Add an option
  addOption(): void {
    this.options.push(this.fb.control('', Validators.required));
  }

  // Remove an option
  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  // Submit the form to create a poll
  submitForm(): void {
    if (this.createPollForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const { title, question, start_at, end_time, options } = this.createPollForm.value;

    // Call the PollService to create a poll
    this.pollService.createPoll(title, question, start_at, end_time).subscribe({
      next: (response: any) => {
        this.isPollCreated = true;
        this.pollID = response.poll.pollID;
        alert('Poll created successfully! Now you can add options.');
      },
      error: (err) => {
        console.error('Error creating poll:', err);
        alert('Error creating poll.');
      }
    });
  }

  // Add options to the created poll
  addOptions(): void {
    if (!this.isPollCreated || !this.pollID) {
      alert('Create a poll first.');
      return;
    }

    const options = this.options.value;

    // Call the PollService to add options to the poll
    this.pollService.addOptions(this.pollID, options).subscribe({
      next: () => {
        alert('Options added successfully!');
        this.createPollForm.reset();
        this.isPollCreated = false;
        this.pollID = null;
      },
      error: (err) => {
        console.error('Error adding options:', err);
        alert('Error adding options.');
      }
    });
  }
}
