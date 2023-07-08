import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TimeTrackingService {
  private startTime: number = 0;
  private totalTime = 0;
  private isActive = true;
  private siteUrl: string = "";
  private clickCount = 0;

  constructor() {}

  startTimer(siteUrl: string): void {
    console.log("Its working");
    this.siteUrl = siteUrl;
    this.startTime = Date.now();

    // Check if the tab is active every second
    setInterval(() => {
      // If the tab is active and matches the provided site, check for recent click events
      if (this.isActive && this.isSiteUrlMatched()) {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.startTime;

        // Check if 5 minutes have passed since the last click event
        if (deltaTime >= 10000) {
          if (this.clickCount > 0) {
            this.totalTime += deltaTime;
          }
          this.startTime = currentTime;
          this.clickCount = 0;
        }
      }
      console.log(this.totalTime);

      // this.clickEvents();
    }, 1000); // 1000 milliseconds = 1 second

    // Listen for click events on the window
    // window.addEventListener('click', () => {
    //   if (this.isActive && this.isSiteUrlMatched()) {
    //     this.clickCount++;
    //     console.log("click count" + this.clickCount)
    //   }
    // });
  }

  setTabActivity(isActive: boolean): void {
    this.isActive = isActive;
  }

  getTotalTime(): number {
    return this.totalTime;
  }

  public clickEvents(): any {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "click") {
        // Handle the received message here
        console.log("Received click message:", message.data);
      }
    });
  }

  async getCurrentUrl() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          let url = tabs[0].url;
          resolve(url);
        } else {
          reject(new Error("Unable to retrieve the URL."));
        }
      });
    });
  }

  isSiteUrlMatched(): any {
    this.getCurrentUrl()
      .then((url) => {
        console.log(url);
        let activeTabUrl: any = String(url);
        console.log(activeTabUrl.includes(this.siteUrl));
        if (!activeTabUrl.includes(this.siteUrl)){
          console.log('Tab not matched')
        }
        return activeTabUrl.includes(this.siteUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
