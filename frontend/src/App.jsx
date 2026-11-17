import { useEffect, useState } from 'react';
import { createRoom, deleteRoom, getRooms, updateRoom } from './api/roomApi';
import './App.css';

const EMPTY_FORM = {
  title: '',
  price: '',
  area: '',
  address: '',
  isAvailable: true
};

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadRooms = async () => {
    try {
      setError('');
      const res = await getRooms();
      setRooms(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể kết nối Backend ASP.NET Core (http://localhost:5000)');
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      area: Number(form.area),
      address: form.address.trim(),
      isAvailable: Boolean(form.isAvailable)
    };

    try {
      if (editingId !== null) {
        await updateRoom(editingId, payload);
        setStatus(`Đã cập nhật phòng #${editingId} (PUT /api/rooms/${editingId})`);
      } else {
        await createRoom(payload);
        setStatus('Đã thêm phòng mới (POST /api/rooms)');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadRooms();
    } catch (err) {
      setError(err.response?.data?.title || err.response?.data?.message || 'Lỗi gửi dữ liệu tới API');
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    setForm({
      title: room.title,
      price: String(room.price),
      area: String(room.area),
      address: room.address,
      isAvailable: room.isAvailable
    });
  };

  const handleDelete = async (id) => {
    setError('');
    setStatus('');
    try {
      await deleteRoom(id);
      setStatus(`Đã xóa phòng #${id} (DELETE /api/rooms/${id})`);
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
      await loadRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Quản lý Phòng Trọ (ASP.NET Core + EF Core + Axios)</h1>
        <p>Demo đầy đủ 4 phương thức GET / POST / PUT / DELETE từ React Axios tới ASP.NET Core Web API</p>
      </header>

      {status && <div className="alert success">{status}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>{editingId !== null ? `Cập nhật phòng #${editingId} (PUT)` : 'Thêm phòng mới (POST)'}</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên phòng (VD: Studio Bình Thạnh)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Giá thuê (VND)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            min="0"
            required
          />
          <input
            type="number"
            placeholder="Diện tích (m²)"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            min="1"
            step="0.5"
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            Còn trống
          </label>
          <div className="actions">
            <button type="submit" className="btn primary">
              {editingId !== null ? 'Lưu cập nhật (PUT)' : 'Thêm phòng (POST)'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="list-header">
          <h2>Danh sách phòng (GET /api/rooms)</h2>
          <button type="button" className="btn secondary" onClick={loadRooms}>
            Tải lại (GET)
          </button>
        </div>

        {rooms.length === 0 ? (
          <p className="muted">Chưa có phòng nào trong database.</p>
        ) : (
          <div className="room-list">
            {rooms.map((room) => (
              <article key={room.id} className="room-item">
                <div>
                  <h3>
                    #{room.id} - {room.title}
                  </h3>
                  <p>
                    {room.address} • {room.area} m² •{' '}
                    <strong>{Number(room.price).toLocaleString('vi-VN')} đ/tháng</strong> •{' '}
                    {room.isAvailable ? 'Còn trống' : 'Đã thuê'}
                  </p>
                </div>
                <div className="actions">
                  <button type="button" className="btn secondary" onClick={() => handleEdit(room)}>
                    Sửa (PUT)
                  </button>
                  <button type="button" className="btn danger" onClick={() => handleDelete(room.id)}>
                    Xóa (DELETE)
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
