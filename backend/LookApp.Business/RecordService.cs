using LookApp.Database.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LookApp.Business
{
    public class RecordService : IRecordService
    {
        private readonly LookAppContext _context;

        public RecordService(LookAppContext dbContext)
        {
            this._context = dbContext;
        }

        public List<Record> GetRecords()
        {
            return _context.Records.ToList();
        }

        public List<Record> GetRecordsByCategoryId(int id)
        {
            return _context.Records.Where(r => r.CategoryId == id).ToList();
        }

        public async Task<Record> GetRecordByIdAsync(int id)
        {
            return await this._context.Records.FindAsync(id);
        }

        public async Task CreateAsync(Record newRecord)
        {
            await this._context.Records.AddAsync(newRecord);
            await this._context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Record recordToDelete)
        {
            if (recordToDelete != null)
            {
                this._context.Records.Remove(recordToDelete);
            }

            await this._context.SaveChangesAsync();
        }
    }
}
