import { Component, OnDestroy } from '@angular/core';
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
export class MainPageComponent implements OnDestroy {
  user: any;
  activePolls: any[] = [];
  endedPolls: any[] = [];
  errorActive: string | null = null;
  errorEnded: string | null = null;
  timers: { [key: number]: string } = {};
  isDisabled: boolean = true;
  selectedPanel: string = 'active';
  pollOptions: { [pollID: number]: { content: string; optionID: number }[] } = {};
  pollVotes: { [pollID: number]: { optionID: number; voteCount: number; percentage: string }[] } = {};
  pollPercentages: { [pollID: number]: { optionID: number; percentage: number }[] } = {};
  selectedOptions: { [pollID: number]: string } = {};
  refreshInterval: number = 10000; 
  private intervalId: any;
  pollVotesStatus: { [pollID: number]: string } = {}; // String status for each poll

  constructor(
    private authService: AuthService,
    private pollService: PollService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.fetchActivePolls();
    this.fetchEndedPolls();

    // Set up auto-refresh
    this.intervalId = setInterval(() => {
      this.fetchActivePolls();
      this.fetchEndedPolls();
    }, this.refreshInterval);
  }

  ngOnDestroy(): void {
    // Clear the interval on component destroy
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  checkIfVoted(pollID: number): string {
    // Use the stored user status for the given poll
    const userStatus = this.pollVotesStatus[pollID];
    if (userStatus === 'voted') {
      return 'voted';
    }
    if (userStatus === 'owner') {
      return 'owner';
    }
    return 'not voted'; 
  }
  
  

  submitVote(pollID: number): void {
    const selectedOption = this.selectedOptions[pollID];
    if (!selectedOption) {
      console.error('No option selected for poll:', pollID);
      return;
    }

    const option = this.pollOptions[pollID].find(opt => opt.content === selectedOption);
    if (!option) {
      console.error('Selected option not found for poll:', pollID);
      return;
    }

    const optionID = option.optionID; 

    this.pollService.validateVote(pollID, optionID).subscribe(
      (response) => {
        console.log('Vote submitted successfully:', response);
        alert('Your vote has been submitted!');
        this.fetchVotesForPoll(pollID);  // Refresh vote data
        this.initializeTimers();  // Refresh timers
        this.pollVotesStatus[pollID] = 'voted'; // Mark user as 'voted'
      },
      (error) => {
        console.error('Error submitting vote:', error);
        alert(error.error?.msg || 'Failed to submit vote');
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
          this.fetchVotesForPoll(poll.pollID);
        },
        (error: any) => {
          console.error('Error fetching options for poll:', error);
        }
      );
    });
  }

  fetchVotesForPoll(pollID: number): void {
    this.pollService.getVotes(pollID).subscribe(
      (response: { options: any[], userStatus: string }) => {
        try {
          const options = response.options;
          const userStatus = response.userStatus; // This could be 'voted' or 'owner'
  
          // Store the user voting status
          this.pollVotesStatus[pollID] = userStatus === 'voted' || userStatus === 'owner' ? userStatus : 'not voted';
  
          const voteCounts = this.calculateVoteCounts(options);
          const totalVotes = options.reduce((total, option) => total + option.voteCount, 0);
          this.saveVoteCounts(pollID, voteCounts, totalVotes);
  
          const percentages = this.calculatePercentages(voteCounts, totalVotes);
          this.savePercentages(pollID, percentages);
        } catch (error) {
          console.error('Error processing votes for poll:', error);
        }
      },
      (error: any) => {
        console.error('Error fetching votes for poll:', error);
      }
    );
  }
  

  // Function to calculate vote counts
  calculateVoteCounts(options: { optionID: number, voteCount: number }[]): { [optionID: number]: number } {
    const voteCounts: { [optionID: number]: number } = {};

    options.forEach(option => {
      voteCounts[option.optionID] = option.voteCount;
    });

    return voteCounts;
  }

  // Function to save the vote counts to state
  private saveVoteCounts(pollID: number, voteCounts: { [optionID: number]: number }, totalVotes: number): void {
    this.pollVotes[pollID] = Object.keys(voteCounts).map(optionID => {
      const voteCount = voteCounts[+optionID];
      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0; // Handle division by zero
      return {
        optionID: +optionID, // Ensure optionID is a number
        voteCount: voteCount, // Access voteCounts using the numeric value of optionID
        percentage: percentage.toFixed(2) // Round the percentage to two decimal places
      };
    });
  }

  // Function to calculate percentages
  private calculatePercentages(voteCounts: { [optionID: number]: number }, totalVotes: number): any[] {
    return Object.keys(voteCounts).map(optionID => ({
      optionID: +optionID, // Ensure optionID is a number
      percentage: (voteCounts[+optionID] / totalVotes) * 100, // Access voteCounts using the numeric value of optionID
    }));
  }

  getVoteCount(pollID: number, optionID: number): number {
    return this.pollVotes[pollID]?.find(vote => vote.optionID === optionID)?.voteCount || 0;
  }

  // Method to get the percentage for an option
  getPercentage(pollID: number, optionID: number): number {
    const percentage = this.pollPercentages[pollID]?.find(p => p.optionID === optionID)?.percentage || 0;
    return +percentage.toFixed(2); // Round to two decimal places
  }

  // Function to save percentages to state
  private savePercentages(pollID: number, percentages: any[]): void {
    this.pollPercentages[pollID] = percentages;
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
