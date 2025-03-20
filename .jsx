// ROI Meter React Component
const { useState, useEffect } = React;

const EditableROIMeter = () => {
  // Initial sample data
  const [channels, setChannels] = useState([
    { id: 1, name: 'Social Media', roi: 320, spend: 15000 },
    { id: 2, name: 'Email Marketing', roi: 450, spend: 8000 },
    { id: 3, name: 'Content Marketing', roi: 280, spend: 12000 },
    { id: 4, name: 'PPC', roi: 220, spend: 20000 },
    { id: 5, name: 'SEO', roi: 510, spend: 10000 }
  ]);
  
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [editMode, setEditMode] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [newChannel, setNewChannel] = useState({ name: '', roi: 0, spend: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Colors for different ROI ranges
  const getColor = (roi) => {
    if (roi >= 400) return '#34D399'; // Green for excellent ROI
    if (roi >= 300) return '#60A5FA'; // Blue for good ROI
    if (roi >= 200) return '#FBBF24'; // Yellow for average ROI
    return '#F87171'; // Red for below average ROI
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate actual return based on ROI percentage and spend
  const calculateReturn = (roi, spend) => {
    return spend * (roi / 100);
  };

  // Handle editing a channel
  const handleEditClick = (channel) => {
    setEditingChannel({...channel});
    setEditMode(true);
  };

  // Save edited channel
  const handleSaveEdit = () => {
    const updatedChannels = channels.map(channel => 
      channel.id === editingChannel.id ? editingChannel : channel
    );
    setChannels(updatedChannels);
    
    // Update selected channel if it was the one being edited
    if (selectedChannel.id === editingChannel.id) {
      setSelectedChannel(editingChannel);
    }
    
    setEditMode(false);
    setEditingChannel(null);
  };

  // Add new channel
  const handleAddChannel = () => {
    if (newChannel.name.trim() === '') return;
    
    const newId = Math.max(...channels.map(c => c.id), 0) + 1;
    const channelToAdd = { 
      ...newChannel, 
      id: newId,
      roi: Number(newChannel.roi),
      spend: Number(newChannel.spend)
    };
    
    setChannels([...channels, channelToAdd]);
    setNewChannel({ name: '', roi: 0, spend: 0 });
    setShowAddForm(false);
  };

  // Delete a channel
  const handleDeleteChannel = (id) => {
    const updatedChannels = channels.filter(channel => channel.id !== id);
    setChannels(updatedChannels);
    
    // If deleted channel was selected, select first available channel
    if (selectedChannel.id === id && updatedChannels.length > 0) {
      setSelectedChannel(updatedChannels[0]);
    }
  };

  // Custom SVG gauge meter
  const GaugeMeter = ({ value, maxValue = 600, color }) => {
    const percentage = Math.min(100, (value / maxValue) * 100);
    const rotation = (percentage / 100) * 180;
    
    return (
      <div className="relative w-full h-full">
        {/* Background semi-circle */}
        <svg viewBox="0 0 100 50" className="w-full">
          <path 
            d="M 10,50 A 40,40 0 0,1 90,50" 
            fill="none" 
            stroke="#E5E7EB" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          
          {/* Foreground progress arc */}
          <path 
            d={`M 10,50 A 40,40 0 ${rotation > 90 ? 1 : 0},1 ${
              10 + 80 * Math.sin((rotation * Math.PI) / 180)
            },${
              50 - 40 * Math.cos((rotation * Math.PI) / 180)
            }`} 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <line 
            x1="50" 
            y1="50" 
            x2={50 + 38 * Math.sin((rotation * Math.PI) / 180)} 
            y2={50 - 38 * Math.cos((rotation * Math.PI) / 180)} 
            stroke="#374151" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          
          {/* Needle center */}
          <circle cx="50" cy="50" r="4" fill="#374151" />
        </svg>
        
        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="text-4xl font-bold" style={{ color }}>
            {value}%
          </div>
          <div className="text-gray-500 text-sm">ROI</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Marketing Channel ROI</h2>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditMode(false);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : 'Add Channel'}
        </button>
      </div>
      
      {/* Add new channel form */}
      {showAddForm && (
        <div className="w-full bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Add New Channel</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Channel Name</label>
              <input 
                type="text" 
                value={newChannel.name}
                onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">ROI (%)</label>
              <input 
                type="number" 
                value={newChannel.roi}
                onChange={(e) => setNewChannel({...newChannel, roi: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Spend ($)</label>
              <input 
                type="number" 
                value={newChannel.spend}
                onChange={(e) => setNewChannel({...newChannel, spend: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <button 
            onClick={handleAddChannel}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Add Channel
          </button>
        </div>
      )}
      
      {/* Edit channel form */}
      {editMode && editingChannel && (
        <div className="w-full bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Edit {editingChannel.name}</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Channel Name</label>
              <input 
                type="text" 
                value={editingChannel.name}
                onChange={(e) => setEditingChannel({...editingChannel, name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">ROI (%)</label>
              <input 
                type="number" 
                value={editingChannel.roi}
                onChange={(e) => setEditingChannel({...editingChannel, roi: Number(e.target.value)})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Spend ($)</label>
              <input 
                type="number" 
                value={editingChannel.spend}
                onChange={(e) => setEditingChannel({...editingChannel, spend: Number(e.target.value)})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleSaveEdit}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Save Changes
            </button>
            <button 
              onClick={() => {
                setEditMode(false);
                setEditingChannel(null);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Main display area */}
      {channels.length > 0 && !editMode && (
        <div className="flex w-full justify-between mb-8">
          <div className="w-1/2 pr-4">
            <div className="w-64 h-64 mx-auto">
              <GaugeMeter 
                value={selectedChannel.roi} 
                color={getColor(selectedChannel.roi)} 
              />
              <div className="text-center text-lg font-semibold mt-2 text-gray-700">
                {selectedChannel.name}
              </div>
            </div>
          </div>
          
          <div className="w-1/2 pl-4 flex flex-col justify-center">
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="text-sm text-gray-500">Investment</div>
              <div className="text-xl font-bold">{formatCurrency(selectedChannel.spend)}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="text-sm text-gray-500">Return</div>
              <div className="text-xl font-bold">
                {formatCurrency(calculateReturn(selectedChannel.roi, selectedChannel.spend))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">Net Profit</div>
              <div className="text-xl font-bold">
                {formatCurrency(calculateReturn(selectedChannel.roi, selectedChannel.spend) - selectedChannel.spend)}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Channel selection and management */}
      <div className="w-full">
        <h3 className="font-medium text-gray-700 mb-2">Marketing Channels</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {channels.map(channel => (
                <tr 
                  key={channel.id} 
                  className={`${selectedChannel.id === channel.id ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
                  onClick={() => !editMode && setSelectedChannel(channel)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{channel.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-sm rounded-full" style={{ backgroundColor: `${getColor(channel.roi)}20`, color: getColor(channel.roi) }}>
                      {channel.roi}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {formatCurrency(channel.spend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {formatCurrency(calculateReturn(channel.roi, channel.spend))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(channel);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChannel(channel.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                      disabled={channels.length <= 1}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add this line at the bottom to render the component
ReactDOM.render(<EditableROIMeter />, document.getElementById('root'));
