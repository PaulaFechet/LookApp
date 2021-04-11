using LookApp.API.Dtos;
using LookApp.Database.Models;

namespace LookApp.API.Mappers
{
    public interface IRecordMapper
    {
        public Record mapToRecord(CreateRecordRequest createRecordRequest);
    }
}
