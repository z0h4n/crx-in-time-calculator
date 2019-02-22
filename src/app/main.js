import InTimeCalculator from './inTimeCalculator';

class Main {
  static async run() {
    await InTimeCalculator.bootstrap();
    chrome.runtime.sendMessage('activate');
  }
}

Main.run();
