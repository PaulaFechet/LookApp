import { Command } from '../command-pattern/command';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private commandHistory: Command[] = [];

  public do(command: Command): void {

    command.do();
    this.commandHistory.push(command);
    console.log(this.commandHistory);
  }

  public undo(): void {

    let lastCommand = this.commandHistory.pop();
    console.log("undo", lastCommand);
    if (lastCommand != undefined) {
      lastCommand.undo();
    }
  }
}
