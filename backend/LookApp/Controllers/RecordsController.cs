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
            var record = _recordService.GetRecords();

            return Ok(record);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetByIdAsync([FromRoute] int id)
        {
            var records = await _recordService.GetRecordByIdAsync(id);
            if (records == null)
            {
                return NotFound("There's no record with the provided id.");
            }

            return Ok(records);
        }

        [HttpGet("recordByCategoryId/{categoryId}")]
        public ActionResult<List<Record>> GetByCategoryIdAsync([FromRoute] int categoryId)
        {
            var records =  _recordService.GetRecordsByCategoryId(categoryId);
            if (records == null)
            {
                return NotFound("There's no category with the provided category id.");
            }

            return Ok(records);
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
