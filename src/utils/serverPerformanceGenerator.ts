export class ServerPerformance {
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkUsage: number;

  constructor() {
    this.cpuUsage = this.getRandomInitialValue();
    this.ramUsage = this.getRandomInitialValue();
    this.diskUsage = this.getRandomInitialValue();
    this.networkUsage = this.getRandomInitialValue();
  }

  getRandomInitialValue() {
    return Math.floor(Math.random() * 51) + 50; // Random integer between 50 and 100
  }

  getRandomChange() {
    return Math.floor(Math.random() * 21) - 10; // Random integer between -10 and 10
  }

  clamp(value: number) {
    return Math.max(0, Math.min(100, value)); // Ensures value is between 0 and 100
  }

  update() {
    this.cpuUsage = this.clamp(this.cpuUsage + this.getRandomChange());
    this.ramUsage = this.clamp(this.ramUsage + this.getRandomChange());
    this.diskUsage = this.clamp(this.diskUsage + this.getRandomChange());
    this.networkUsage = this.clamp(this.networkUsage + this.getRandomChange());
    return this
  }
}