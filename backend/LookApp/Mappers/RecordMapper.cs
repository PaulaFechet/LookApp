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
    }
}
