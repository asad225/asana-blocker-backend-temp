import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private startTime: number = 0;
  private totalTime = 0;
  private isActive = true;
  private siteUrl: string = '';
  private clickCount = 0;

  constructor() {}

  startTimer(siteUrl: string): void {
    this.siteUrl = siteUrl;
    this.startTime = Date.now();

    // Check if the tab is active every second
    setInterval(() => {
      this.isSiteUrlMatched()
    //   // If the tab is active and matches the provided site, check for recent click events
    //   if (this.isActive && this.isSiteUrlMatched()) {
    //     const currentTime = Date.now();
    //     const deltaTime = currentTime - this.startTime;

    //     // Check if 5 minutes have passed since the last click event
    //     if (deltaTime >= 10000) {
    //       if (this.clickCount > 0) {
    //         this.totalTime += deltaTime;
    //       }
    //       this.startTime = currentTime;
    //       this.clickCount = 0;
    //     }
    //   }
    //   console.log(this.totalTime)

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


  // async getCurrentUrl(){
  //   chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  //     let url = tabs[0].url;
  //     // use `url` here inside the callback because it's asynchronous!
  //     return url
  //   });
  // }

  getCurrentUrl() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (tabs && tabs.length > 0) {
          let url = tabs[0].url;
          resolve(url);
        } else {
          reject(new Error("Unable to retrieve the URL."));
        }
      });
    });
  }
  
  // Usage:
  
  

  isSiteUrlMatched(): any {

    this.getCurrentUrl()
    .then(url => {
      console.log(url);
      // let chromeUrl : any = url // Do something with the URL
      // // return chromeUrl.includes(this.siteUrl);
      // console.log('Url of active tab is' + chromeUrl)
      // chromeUrl = String(chromeUrl)
      // return chromeUrl.includes('google.com');
    })
    .catch(error => {
      console.error(error); // Handle any errors
    });

    
    // return currentTabUrl.includes(this.siteUrl);
    
    // const currentSiteUrl = window.location.href;
  }
}
