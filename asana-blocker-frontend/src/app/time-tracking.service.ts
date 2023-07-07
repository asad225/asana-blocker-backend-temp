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
    console.log('Its working')
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
      console.log(this.totalTime)

      this.clickEvents()
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


 
  // async getClickEvent() {
  //   return new Promise((resolve, reject) => {
  //     chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //       console.log('Inside of an get click event')
  //       if (message.action === 'click') {
  //         resolve(message.event)
  //       }else{
  //         reject('Unable to track Click Events')
  //       }
  //     });
  //   })
  // } 
  
  
  // clickEvents(){
  //   this.getClickEvent()
  //   .then((event)=>{
  //     console.log('CLick Events Called')
      
  //     console.log(event)
  //   })
  //   .catch((err)=>{
  //     console.log(err)
  //   })
  // }

  clickEvents(){
    console.log('Inside of click event')
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Inside of click eventg message listener')
      if (message.action === 'click') {
        // Handle the click event
        console.log(message.event)
      }
    });
  }

 

  async getCurrentUrl() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs && tabs.length > 0) {
          let url = tabs[0].url;
          resolve(url);
        } else {
          reject(new Error("Unable to retrieve the URL."));
        }
      });
    })
  }    
    
    isSiteUrlMatched(): any {
      this.getCurrentUrl()
        .then(url => {
          console.log(url);
          let activeTabUrl : any = String(url)
          console.log(activeTabUrl.includes(this.siteUrl))
          return activeTabUrl.includes(this.siteUrl);
        })
        .catch(error => {
          console.error(error);
        });
    }
  //   });
  // }
  // async getCurrentUrl() {
    
  //     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //       if (tabs && tabs.length > 0) {
  //         let url = tabs[0].url;
  //         console.log(url)
  //       } else {
  //         console.log('Unable to retrieve')
  //       }
  //     });


      
    
  // }
  
  // Usage:
  
  // isSiteUrlMatched(): any {

  //   this.getCurrentUrl()
  //   .then(url => {
  //     console.log(url);
  //     let chromeUrl : any = url // Do something with the URL
  //     // return chromeUrl.includes(this.siteUrl);
  //     console.log('Url of active tab is' + chromeUrl)
  //     chromeUrl = String(chromeUrl)
  //     return chromeUrl.includes('google.com');
  //   })
  //   .catch(error => {
  //     console.error(error); // Handle any errors
  //   });
    
  // }
    
    // return currentTabUrl.includes(this.siteUrl);
    
    // const currentSiteUrl = window.location.href;


    

    // getCurrentUrl(): Promise<string> {
    //   return new Promise((resolve, reject) => {
    //     chrome.runtime.sendMessage({ action: 'getCurrentUrl' }, response => {
    //       if (chrome.runtime.lastError) {
    //         reject(new Error(chrome.runtime.lastError.message));
    //       } else {
    //         console.log(response)
    //         resolve(response);
    //       }
    //     });
    //   });
    // }

}


