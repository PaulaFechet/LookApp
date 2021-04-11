using LookApp.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LookApp.Business
{
    public interface IRecordService
    {
        public List<Record> GetRecords();
        public Task<Record> GetRecordByIdAsync(int id);
        Task DeleteAsync(Record recordToDelete);
        Task CreateAsync(Record newRecord);
    }
}
