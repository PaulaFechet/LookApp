import { BehaviorSubject, Observable } from 'rxjs';
import { Command } from '../command-pattern/command';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private readonly commandHistory: Command[] = [];
  private readonly commandCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public readonly commandCount$: Observable<number> = this.commandCount.asObservable();

  public do(command: Command): void {

    command.do();
    this.commandHistory.push(command);
    this.commandCount.next(this.commandHistory.length);
  }

  public undo(): void {

    let lastCommand = this.commandHistory.pop();
    if (lastCommand != undefined) {
      lastCommand.undo();
      this.commandCount.next(this.commandHistory.length);
    }
  }
}
