import { RecordModel } from '../models/record';
import { RecordService } from '../services/record.service';

export interface Command {
  do(): void;
  undo(): void;
}

export class AddRecordCommand implements Command {
  private recordService: RecordService;
  private recordModel: RecordModel;

  constructor(recordService: RecordService, recordModel: RecordModel) {
    this.recordService = recordService;
    this.recordModel = recordModel;
  }

  public do(): void {
    this.recordService.addRecord(this.recordModel).subscribe(addedRecord => {
      this.recordModel.id = addedRecord.id;
    });
  }

  public undo(): void {
    this.recordService.deleteRecord(
      this.recordModel.categoryId,
      this.recordModel.id).subscribe();
  }
}

class ImportCommand implements Command {


  private a: string;

  private b: string;

  constructor(a: string, b: string) {
    this.a = a;
    this.b = b;
  }

  public do(): void {
    console.log('ComplexCommand: Complex stuff should be done by a receiver object.');

  }

  public undo(): void {
    console.log("undo");
  }
}
