import { RecordModel } from 'src/app/shared/models/record';
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

export class ImportRecordCommand implements Command {

  private csvRecords: any[];
  private categoryId: number;
  private recordService: RecordService;
  private recordModel: RecordModel[];


  constructor(recordService: RecordService, recordModel: RecordModel[], categoryId: number) {
    this.categoryId = categoryId;
    this.recordService = recordService;
    this.recordModel = recordModel;
  }

  public do(): void {

    for (let i = 0; i < this.recordModel.length; i++) {
      let index = i;
      console.log(index);
      this.recordService.addRecord(this.recordModel[index]).subscribe(addedRecord => {
        this.recordModel[index].id = addedRecord.id;
        console.log(this.recordModel);
      });
    }
  }

  public undo(): void {

    for (let i = 0; i < this.recordModel.length; i++) {
    this.recordService.deleteRecord(
      this.categoryId,
      this.recordModel[i].id).subscribe();
    }
  }
}
