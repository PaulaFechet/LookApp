using LookApp.API.Dtos;
using LookApp.Database.Models;


namespace LookApp.API.Mappers
{
    public class RecordMapper : IRecordMapper
    {
        public Record mapToRecord(CreateRecordRequest createRecordRequest)
        {
            return new Record
            {
                Id = 0,
                Note = createRecordRequest.Note,
                Value = createRecordRequest.Value,
                Date = createRecordRequest.Date,
                CategoryId = createRecordRequest.CategoryId
            };
        }

        public Record MapToUpdatedRecord(Record recordToUpdate, UpdateRecordRequest updatedRecord, int recordId)
        {
            recordToUpdate.Id = recordId;
            recordToUpdate.Date = updatedRecord.Date;
            recordToUpdate.Note = updatedRecord.Note;
            recordToUpdate.Value = updatedRecord.Value;
            recordToUpdate.CategoryId = updatedRecord.CategoryId;
   

            return recordToUpdate;
        }
    }
}
