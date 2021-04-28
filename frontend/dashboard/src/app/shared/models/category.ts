import {RecordModel} from './record';
import { User } from './user';

export class CategoryModel{
  id: number;
  title: string;
  description: string;
  type: string;
  records: RecordModel[];
  creatorId: number;
  creator?: User;
}
