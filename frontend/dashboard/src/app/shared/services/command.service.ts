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
  }

  public undo(): void {

    let lastCommand = this.commandHistory.pop();

    if (lastCommand != undefined) {
      lastCommand.undo();
    }
  }
}
