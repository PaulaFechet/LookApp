import {RecordModel} from './record';
import { User } from './user';

export class CategoryModel{
  id: number;
  title: string;
  description: string;
  unitOfMeasure: string;
  lowerLimit?: number;
  upperLimit?: number;
  records: RecordModel[];
  creatorId: number;
  creator?: User;
}
