import {RecordModel} from './record';

export class CategoryModel{
  id: number;
  title: number;
  description: string;
  type: string;
  records: RecordModel[];
}
