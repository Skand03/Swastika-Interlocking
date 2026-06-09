import React, { useState, useEffect } from 'react';
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function Settings({ user, language }) {
  const { authFetch } = useAuth();
  const [settings, setSettings] = useState({
    companyName: '',
    gstNumber: '',
    address: '',
    deliveryZones: [],
    staff: []
  });
  const [statusMsg, setStatusMsg] = useState('');

  // Load settings on mount
  useEffect(() => {
    authFetch(`${API_BASE}/api/get_settings.php`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/save_settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      const result = await res.json();
      setStatusMsg(result.success ? 'Settings saved successfully.' : result.message || 'Failed to save.');
    } catch {
      setStatusMsg('Server error while saving settings.');
    }
  };

  // Helper for delivery zone rows
  const addZone = () => {
    setSettings(prev => ({
      ...prev,
      deliveryZones: [...prev.deliveryZones, { area: '', surcharge: '' }]
    }));
  };
  const updateZone = (index, key, value) => {
    const zones = [...settings.deliveryZones];
    zones[index][key] = value;
    setSettings(prev => ({ ...prev, deliveryZones: zones }));
  };
  const removeZone = index => {
    const zones = settings.deliveryZones.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, deliveryZones: zones }));
  };

  // Staff rows
  const addStaff = () => {
    setSettings(prev => ({
      ...prev,
      staff: [...prev.staff, { name: '', role: '' }]
    }));
  };
  const updateStaff = (index, key, value) => {
    const staff = [...settings.staff];
    staff[index][key] = value;
    setSettings(prev => ({ ...prev, staff }));
  };
  const removeStaff = index => {
    const staff = settings.staff.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, staff }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-extrabold text-2xl text-gray-800 mb-4">Settings / सेटिंग्स</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name / कंपनी नाम</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={e => handleChange('companyName', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number / जीएसटी नंबर</label>
            <input
              type="text"
              value={settings.gstNumber}
              onChange={e => handleChange('gstNumber', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address / पता</label>
            <textarea
              rows={3}
              value={settings.address}
              onChange={e => handleChange('address', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </div>

      {/* Delivery Zones */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Delivery Zones / डिलीवरी ज़ोन्स</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Area / क्षेत्र</th>
              <th className="px-4 py-2 text-left">Surcharge (₹) / अतिरिक्त शुल्क</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {settings.deliveryZones.map((z, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={z.area}
                    onChange={e => updateZone(i, 'area', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={z.surcharge}
                    onChange={e => updateZone(i, 'surcharge', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => removeZone(i)} className="text-red-500 hover:text-red-700">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addZone}
          className="mt-4 flex items-center gap-2 text-sm text-orange-600 hover:underline"
        >
          <span className="material-symbols-outlined text-sm">add</span> Add Zone
        </button>
      </div>

      {/* Staff Access */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Staff Access / स्टाफ एक्सेस</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Name / नाम</th>
              <th className="px-4 py-2 text-left">Role / भूमिका</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {settings.staff.map((s, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={s.name}
                    onChange={e => updateStaff(i, 'name', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={s.role}
                    onChange={e => updateStaff(i, 'role', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option>Super Admin</option>
                    <option>Manager</option>
                    <option>Sales Rep</option>
                    <option>Support</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => removeStaff(i)} className="text-red-500 hover:text-red-700">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addStaff}
          className="mt-4 flex items-center gap-2 text-sm text-orange-600 hover:underline"
        >
          <span className="material-symbols-outlined text-sm">person_add</span> Add Staff
        </button>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition"
        >
          Save Settings
        </button>
        {statusMsg && (
          <p className="text-sm font-medium text-green-600">{statusMsg}</p>
        )}
      </div>
    </div>
  );
}
