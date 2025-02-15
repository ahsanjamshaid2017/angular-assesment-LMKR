import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Crypto, STREAM_MESSAGES, STREAM_STATUS } from './models/data.model';
import { DataService } from './services/data.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  cryptoData: Crypto[] = [];
  refreshed = false;
  streamMessage = STREAM_MESSAGES;
  streamStatus: STREAM_STATUS = STREAM_STATUS.Active;
  private stopNewStream = new Subject<void>();
  private cancelOnGoingCalls = new Subject<void>();
  private streamSub: Subscription;

  constructor(
    private dataService: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.startStream();
  }

  // This function will start a stream to fetch data after every 5 seconds and it will imitatively fetch data on first time
  startStream(): void {
    this.stopNewStream = new Subject<void>();
    this.cancelOnGoingCalls = new Subject<void>();
    this.streamStatus = STREAM_STATUS.Active;

    this.streamSub = interval(5000)
      .pipe(
        startWith(0),
        takeUntil(this.stopNewStream),
        switchMap(() =>
          this.dataService.fetchAssets().pipe(takeUntil(this.cancelOnGoingCalls))
        )
      )
      .subscribe({
        next: (response) => {
          this.cryptoData = response.data;
        },
        error: (error) => {
          console.error('Error fetching data', error);
        }
      });
  }

  // This function will cancel the stream but would not affect the in flight requests.
  cancelStream(): void {
    this.stopNewStream.next();
    this.streamStatus = STREAM_STATUS.Paused;
    this.displayToast('warn');
    this.refreshed = false;
  }

   //Completely stops the stream and cancels both new and in-flight API calls.
  stopStream(): void {
    this.stopNewStream.next();
    this.cancelOnGoingCalls.next();
    if (this.streamSub) {
      this.streamSub.unsubscribe();
    }
    this.streamStatus = STREAM_STATUS.Inactive;
    this.displayToast('error');
    this.refreshed = false;
  }

  // This is a separate call to fetch latest record by clicking on refresh button
  refreshStream(): void {
    this.dataService.fetchAssets()
      .pipe(takeUntil(this.cancelOnGoingCalls))
      .subscribe({
        next: (response) => {
          this.cryptoData = response?.data;
          this.displayToast('success', 'refreshed');
          this.refreshed = true;
        },
        error: (error) => {
          console.error('Error refreshing data', error);
        }
      });
  }

  // This method will display toast messages
  displayToast(severity: string, summary?: string) {
    this.messageService.add({
      severity: severity,
      summary: summary ? summary.toUpperCase() : this.streamStatus.toUpperCase(),
      detail: this.streamMessage[summary ? summary : this.streamStatus]
    });
  }

  ngOnDestroy(): void {
    // Cancel both in-flight and stream requests on component destruction
    this.stopNewStream.next();
    this.cancelOnGoingCalls.next();
    if (this.streamSub) {
      this.streamSub.unsubscribe();
    }
  }
}

