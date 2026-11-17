using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomApi.Data;
using RoomApi.Models;

namespace RoomApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/rooms
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        return await _context.Rooms.OrderByDescending(r => r.Id).ToListAsync();
    }

    // GET: api/rooms/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Room>> GetRoom(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room is null)
        {
            return NotFound(new { message = $"Không tìm thấy phòng #{id}" });
        }
        return room;
    }

    // POST: api/rooms
    [HttpPost]
    public async Task<ActionResult<Room>> CreateRoom([FromBody] Room room)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        room.Id = 0;
        room.CreatedAt = DateTime.UtcNow;
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room);
    }

    // PUT: api/rooms/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Room>> UpdateRoom(int id, [FromBody] Room updated)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var existing = await _context.Rooms.FindAsync(id);
        if (existing is null)
        {
            return NotFound(new { message = $"Không tìm thấy phòng #{id}" });
        }

        existing.Title = updated.Title;
        existing.Price = updated.Price;
        existing.Area = updated.Area;
        existing.Address = updated.Address;
        existing.IsAvailable = updated.IsAvailable;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: api/rooms/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        var existing = await _context.Rooms.FindAsync(id);
        if (existing is null)
        {
            return NotFound(new { message = $"Không tìm thấy phòng #{id}" });
        }

        _context.Rooms.Remove(existing);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
