using LookApp.API.Dtos;
using LookApp.API.Mappers;
using LookApp.Business;
using LookApp.Database.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LookApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : Controller
    {
        private readonly IRecordService _recordService;
        private readonly IRecordMapper _recordMapper;

        public RecordsController(
                 IRecordService recordService,
                 IRecordMapper recordMapper)
        {
            this._recordService = recordService;
            this._recordMapper = recordMapper;
        }

        [HttpGet("allRecordDetails")]
        public ActionResult<List<Record>> GetAllInformationCategories()
        {
            var categories = _recordService.GetRecords();

            return Ok(categories);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var result = await _recordService.GetRecordByIdAsync(id);
            await _recordService.DeleteAsync(result);
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult> CreateAsync(CreateRecordRequest createRecordRequest)
        {
            var newRecord = _recordMapper.mapToRecord(createRecordRequest);
            await _recordService.CreateAsync(newRecord);

            return Created(newRecord.Id.ToString(), null);
        }
    }
}
