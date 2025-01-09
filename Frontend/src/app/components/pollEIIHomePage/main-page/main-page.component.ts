import { Component } from '@angular/core';
import { AuthService } from '../../../services/Auth/auth-service.service';
import { PollService } from '../../../services/Poll/poll.service';
import { FormsModule } from '@angular/forms';
import { NavigationbarComponent } from '../../navigationbar/navigationbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [NavigationbarComponent, CommonModule, FormsModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  user: any;
  activePolls: any[] = [];
  endedPolls: any[] = [];
  errorActive: string | null = null;
  errorEnded: string | null = null;
  timers: { [key: number]: string } = {};
  isDisabled: boolean = true;
  selectedPanel: string = 'active';
  pollOptions: { [pollID: number]: { content: string }[] } = {};
  selectedOptions: { [pollID: number]: string } = {}; 

  constructor(
    private authService: AuthService,
    private pollService: PollService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.fetchActivePolls();
    this.fetchEndedPolls();
  }

  getUserInfo(): any {
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.user = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  fetchActivePolls(): void {
    this.pollService.getActivePolls().subscribe(
      (polls: any) => {
        this.activePolls = polls.polls;
        this.initializeTimers();
        this.fetchOptionsForPolls(this.activePolls);
      },
      (error: any) => {
        console.error('Error fetching active polls:', error);
        this.errorActive = 'Failed to load active polls';
      }
    );
  }

  fetchEndedPolls(): void {
    this.pollService.getEndedPolls().subscribe(
      (polls: any) => {
        this.endedPolls = polls.polls;
        this.fetchOptionsForPolls(this.endedPolls);
      },
      (error: any) => {
        console.error('Error fetching ended polls:', error);
        this.errorEnded = 'Failed to load ended polls';
      }
    );
  }

  fetchOptionsForPolls(polls: any[]): void {
    polls.forEach((poll) => {
      this.pollService.getOptions(poll.pollID).subscribe(
        (options: any) => {
          this.pollOptions[poll.pollID] = options;
        },
        (error: any) => {
          console.error('Error fetching options for poll:', error);
        }
      );
    });
  }

  initializeTimers(): void {
    this.activePolls.forEach((poll, index) => {
      this.updateTimer(index, poll.end_time);
    });

    setInterval(() => {
      this.activePolls.forEach((poll, index) => {
        this.updateTimer(index, poll.end_time);
      });
    }, 1000);
  }

  updateTimer(index: number, endTime: string): void {
    const endDate = new Date(endTime).getTime();
    const now = new Date().getTime();
    const remainingTime = endDate - now;

    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      this.timers[index] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      this.timers[index] = 'Poll ended';
    }
  }

  handleOptionChange(pollID: number): void {
    console.log(`Selected option for poll ${pollID}:`, this.selectedOptions[pollID]);
  }

  switchPanel(panel: string): void {
    this.selectedPanel = panel;
  }
}