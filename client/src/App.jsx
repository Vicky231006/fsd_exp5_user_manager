import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiEdit2, FiX } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ userId: '', name: '', email: '', age: '', hobbies: '', bio: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', age: '', hobbies: '', bio: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [filterHobby, setFilterHobby] = useState('');
  const [filterBio, setFilterBio] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}?search=${search}`);
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, hobbies: formData.hobbies.split(',').map(h => h.trim()), age: parseInt(formData.age) };
    await axios.post(API_BASE, data);
    setFormData({ userId: '', name: '', email: '', age: '', hobbies: '', bio: '' });
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    await axios.delete(`${API_BASE}/${userId}`);
    fetchUsers();
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditData({
      name: user.name,
      email: user.email,
      age: user.age || '',
      hobbies: user.hobbies ? user.hobbies.join(', ') : '',
      bio: user.bio || ''
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const data = { 
      ...editData, 
      hobbies: editData.hobbies.split(',').map(h => h.trim()).filter(h => h),
      age: editData.age ? parseInt(editData.age) : null
    };
    await axios.put(`${API_BASE}/${editingId}`, data);
    setEditingId(null);
    fetchUsers();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', email: '', age: '', hobbies: '', bio: '' });
  };

  const handleFilter = async (filterType) => {
    try {
      let query = `${API_BASE}?`;
      
      if (filterType === 'email-age' && filterEmail && filterAge) {
        query += `email=${encodeURIComponent(filterEmail)}&age=${filterAge}`;
        setActiveFilter(`Email: ${filterEmail}, Age: ${filterAge}`);
      } else if (filterType === 'hobby' && filterHobby) {
        query += `hobby=${encodeURIComponent(filterHobby)}`;
        setActiveFilter(`Hobby: ${filterHobby}`);
      } else if (filterType === 'bio' && filterBio) {
        query += `bio=${encodeURIComponent(filterBio)}`;
        setActiveFilter(`Bio Search: ${filterBio}`);
      } else {
        return;
      }

      const res = await axios.get(query);
      setUsers(res.data);
      setShowFilterModal(false);
    } catch (err) {
      console.error('Filter error:', err);
      alert('Error applying filter');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterEmail('');
    setFilterAge('');
    setFilterHobby('');
    setFilterBio('');
    setActiveFilter(null);
    fetchUsers();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f0', color: '#000000', padding: '40px 20px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* TITLE */}
      <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '40px', border: '5px solid #000', display: 'inline-block', padding: '18px 36px', background: '#FFFF00', boxShadow: '8px 8px 0px #000', letterSpacing: '3px' }}>
        USER MANAGER
      </h1>

      {/* OUTER BOX CONTAINER */}
      <div style={{ background: '#fff', border: '6px solid #000', padding: '40px', boxShadow: '12px 12px 0px #000', maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '450px 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* FORM SECTION - LEFT SIDE */}
        <div style={{ background: '#fff', border: '5px solid #000', padding: '30px', boxShadow: '8px 8px 0px #000', height: 'fit-content' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '25px', letterSpacing: '1.5px', borderBottom: '4px solid #FFFF00', paddingBottom: '12px' }}>ADD USER</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={fieldGroup}>
              <label style={labelStyle}>IDENTITY</label>
              <input placeholder="UUID-882" style={inputStyleBold} value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>FULL NAME</label>
              <input placeholder="John Doe" style={inputStyleBold} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>EMAIL</label>
              <input placeholder="name@company.com" style={inputStyleBold} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>AGE</label>
              <input placeholder="25" style={inputStyleBold} type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>HOBBIES</label>
              <input placeholder="Reading, Gaming" style={inputStyleBold} value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>BIO</label>
              <textarea placeholder="Your bio..." style={{...inputStyleBold, height: '70px', resize: 'none'}} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
            </div>
            
            <button type="submit" style={{...btnStyleBold, marginTop: '12px', fontSize: '16px', padding: '12px 24px'}}>
              ADD USER
            </button>
          </form>
        </div>

        {/* USERS GRID - RIGHT SIDE */}
        <div style={{ background: '#fff', border: '5px solid #000', padding: '30px', boxShadow: '8px 8px 0px #000', minHeight: '400px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1.5px', borderBottom: '4px solid #FFFF00', paddingBottom: '12px' }}>USERS</h2>
          
          {/* SEARCH & FILTER BAR */}
          <div style={{ marginBottom: '25px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input 
              placeholder="🔍 Search by name..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{...inputStyleBold, flex: 1, minWidth: '200px', padding: '10px'}}
            />
            <button 
              onClick={() => setShowFilterModal(true)}
              style={{...btnStyleBold, padding: '10px 20px', fontSize: '14px', width: 'auto'}}
            >
              ⚙️ FILTER
            </button>
            {activeFilter && (
              <button 
                onClick={clearFilters}
                style={{...btnStyleBold, padding: '10px 15px', fontSize: '12px', width: 'auto', background: '#ff6b6b'}}
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* ACTIVE FILTER DISPLAY */}
          {activeFilter && (
            <div style={{ 
              background: '#FFFF00', 
              border: '3px solid #000', 
              padding: '10px 15px', 
              marginBottom: '20px', 
              fontWeight: 'bold',
              borderRadius: '4px'
            }}>
              Active Filter: {activeFilter}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
            {users.length > 0 ? (
              users.map(user => (
                <div 
                  key={user._id} 
                  style={userCardStyle}
                  onClick={() => setSelectedUser(user)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#000', textAlign: 'center' }}>{user.name}</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '12px', color: '#333', textAlign: 'center', borderTop: '2px solid #FFFF00', paddingTop: '8px' }}>🆔 {user.userId}</p>
                  <p style={{ fontWeight: 'bold', fontSize: '11px', color: '#3b82f6', marginTop: '8px', textAlign: 'center', fontStyle: 'italic' }}>Click for details</p>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL POPUP MODAL */}
      {selectedUser && (
        <div style={modalOverlayStyle} onClick={() => setSelectedUser(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>USER DETAILS</h2>
              <button onClick={() => setSelectedUser(null)} style={closeModalBtn}>
                <FiX size={28} />
              </button>
            </div>

            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '3px solid #000' }}>
              <p style={{ marginBottom: '10px' }}><strong>NAME:</strong> {selectedUser.name}</p>
              <p style={{ marginBottom: '10px' }}><strong>EMAIL:</strong> {selectedUser.email}</p>
              <p style={{ marginBottom: '10px' }}><strong>AGE:</strong> {selectedUser.age || 'Not specified'}</p>
              <p style={{ marginBottom: '10px' }}><strong>USER ID:</strong> {selectedUser.userId}</p>
              <p style={{ marginBottom: '10px' }}><strong>HOBBIES:</strong> {selectedUser.hobbies && selectedUser.hobbies.length > 0 ? selectedUser.hobbies.join(', ') : 'None'}</p>
              <p style={{ marginBottom: '10px' }}><strong>BIO:</strong> {selectedUser.bio || 'No bio provided'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                onClick={() => {
                  setSelectedUser(null);
                  startEdit(selectedUser);
                }} 
                style={editBtnModal}
              >
                <FiEdit2 size={18} style={{ marginRight: '5px' }} /> EDIT
              </button>
              <button 
                onClick={() => {
                  deleteUser(selectedUser._id);
                  setSelectedUser(null);
                }} 
                style={deleteBtnModal}
              >
                <FiTrash2 size={18} style={{ marginRight: '5px' }} /> DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingId && (
        <div style={modalOverlayStyle} onClick={() => cancelEdit()}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>EDIT USER</h2>
              <button onClick={() => cancelEdit()} style={closeModalBtn}>
                <FiX size={28} />
              </button>
            </div>

            <form onSubmit={handleEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div style={fieldGroup}>
                  <label style={labelStyle}>NAME</label>
                  <input style={inputStyleBold} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} required />
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>EMAIL</label>
                  <input style={inputStyleBold} type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} required />
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>AGE</label>
                  <input style={inputStyleBold} type="number" value={editData.age} onChange={e => setEditData({...editData, age: e.target.value})} />
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>HOBBIES</label>
                  <input style={inputStyleBold} value={editData.hobbies} onChange={e => setEditData({...editData, hobbies: e.target.value})} />
                </div>
              </div>
              <div style={fieldGroup}>
                <label style={labelStyle}>BIO</label>
                <textarea style={{...inputStyleBold, height: '80px', resize: 'vertical'}} value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="submit" style={{...btnStyleBold, background: '#FFFF00'}}>
                  SAVE
                </button>
                <button type="button" onClick={() => cancelEdit()} style={{...btnStyleBold, background: '#ff6b6b'}}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div style={modalOverlayStyle} onClick={() => setShowFilterModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>ADVANCED FILTERS</h2>
              <button onClick={() => setShowFilterModal(false)} style={closeModalBtn}>
                <FiX size={28} />
              </button>
            </div>

            {/* FILTER 1: EMAIL & AGE */}
            <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '3px solid #FFFF00' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🔍 Filter by Email & Age</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={fieldGroup}>
                  <label style={labelStyle}>EMAIL</label>
                  <input 
                    placeholder="user@example.com" 
                    style={inputStyleBold} 
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                  />
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>AGE</label>
                  <input 
                    placeholder="25" 
                    style={inputStyleBold} 
                    type="number"
                    value={filterAge}
                    onChange={(e) => setFilterAge(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={() => handleFilter('email-age')}
                style={{...btnStyleBold, width: '100%'}}
              >
                SEARCH BY EMAIL & AGE
              </button>
            </div>

            {/* FILTER 2: HOBBIES */}
            <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '3px solid #FFFF00' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🎮 Filter by Hobby</h3>
              <div style={fieldGroup}>
                <label style={labelStyle}>HOBBY NAME</label>
                <input 
                  placeholder="e.g., reading, gaming, sports..." 
                  style={inputStyleBold}
                  value={filterHobby}
                  onChange={(e) => setFilterHobby(e.target.value)}
                />
              </div>
              <button 
                onClick={() => handleFilter('hobby')}
                style={{...btnStyleBold, width: '100%'}}
              >
                SEARCH BY HOBBY
              </button>
            </div>

            {/* FILTER 3: BIO TEXT SEARCH */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>📝 Text Search in Bio</h3>
              <div style={fieldGroup}>
                <label style={labelStyle}>SEARCH KEYWORD</label>
                <input 
                  placeholder="e.g., developer, designer..." 
                  style={inputStyleBold}
                  value={filterBio}
                  onChange={(e) => setFilterBio(e.target.value)}
                />
              </div>
              <button 
                onClick={() => handleFilter('bio')}
                style={{...btnStyleBold, width: '100%'}}
              >
                SEARCH IN BIO
              </button>
            </div>

            <button 
              onClick={() => setShowFilterModal(false)}
              style={{...btnStyleBold, background: '#ff6b6b', width: '100%'}}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles Object ---
const fieldGroup = { marginBottom: '16px' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.2px', display: 'block', marginBottom: '6px', color: '#000', textTransform: 'uppercase' };
const inputStyleBold = {
  width: '100%',
  padding: '12px',
  border: '3px solid #000',
  background: '#fff',
  fontWeight: 'bold',
  fontSize: '14px',
  outline: 'none',
  cursor: 'text',
  transition: 'all 0.15s',
  boxSizing: 'border-box',
};
const btnStyleBold = {
  padding: '12px 24px',
  background: '#FFFF00',
  border: '3px solid #000',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '4px 4px 0px #000',
  transition: 'all 0.1s',
  width: '100%',
  boxSizing: 'border-box',
};
const userCardStyle = {
  background: '#fff',
  border: '4px solid #000',
  padding: '18px',
  boxShadow: '6px 6px 0px #000',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minHeight: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};
const modalStyle = {
  background: '#fff',
  border: '4px solid #000',
  padding: '30px',
  maxWidth: '650px',
  width: '90%',
  boxShadow: '10px 10px 0px #000',
  maxHeight: '90vh',
  overflowY: 'auto',
};
const closeModalBtn = {
  background: 'none',
  border: 'none',
  fontSize: '28px',
  cursor: 'pointer',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const editBtnModal = {
  padding: '12px 24px',
  background: '#3b82f6',
  border: '3px solid #000',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '4px 4px 0px #000',
  transition: 'all 0.1s',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const deleteBtnModal = {
  padding: '12px 24px',
  background: '#ff6b6b',
  border: '3px solid #000',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '4px 4px 0px #000',
  transition: 'all 0.1s',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default App;