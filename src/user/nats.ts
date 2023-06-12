import nats, { Stan } from "node-nats-streaming";

class Nats {
  private _cli?: Stan;

  get cli() {
    if (!this._cli) {
      throw new Error("Cannot access NATS");
    }
    return this._cli;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._cli = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.cli.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.cli.on("error", (e) => reject(e));
    });
  }
}

export default new Nats();
