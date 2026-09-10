import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Layers, Package } from 'lucide-react';

function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state;

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 max-w-md text-center">
          <p className="text-gray-700 font-medium">No event data found.</p>
          <button
            onClick={() => navigate('/view-events')}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-xl font-semibold shadow-md"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-black overflow-hidden flex flex-col">
      <NavBar />

      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium mb-6 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <span className="text-xs px-3 py-1 rounded-full bg-accent-orange/10 text-accent-orange font-bold border border-accent-orange/20 uppercase tracking-wider">
              {event.event_id || 'ID N/A'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{event.name}</h1>
            {event.tagline && <p className="text-lg text-gray-600 font-medium mt-1">{event.tagline}</p>}
            <p className="text-gray-700 mt-4 leading-relaxed">{event.about}</p>
          </div>

          {/* Form Specifications */}
          {event.form && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-orange" />
                Schedule & Venue Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 text-sm text-gray-700">
                <div><span className="font-semibold text-gray-900">Event Day:</span> {event.form.day || 'N/A'}</div>
                <div><span className="font-semibold text-gray-900">Slot:</span> {event.form.slot || 'N/A'}</div>
                <div><span className="font-semibold text-gray-900">Duration:</span> {event.form.duration || 'N/A'}</div>
                <div><span className="font-semibold text-gray-900">Participant Type:</span> {event.form.participant_type || 'N/A'}</div>
                <div><span className="font-semibold text-gray-900">Team Size:</span> {event.form.team_min || 1} - {event.form.team_max || 1}</div>
                <div><span className="font-semibold text-gray-900">Preferred Halls:</span> {event.form.preferred_halls || 'N/A'}</div>
              </div>
            </div>
          )}

          {/* Rounds */}
          {Array.isArray(event.rounds) && event.rounds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent-orange" />
                Rounds & Rules
              </h3>
              <div className="space-y-4">
                {event.rounds.map((round, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <h4 className="font-bold text-gray-900 text-base">{round.name || `Round ${idx + 1}`}</h4>
                    <p className="text-gray-600 text-sm mt-1">{round.description}</p>
                    {Array.isArray(round.rules) && round.rules.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rules:</span>
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                          {round.rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          {Array.isArray(event.items) && event.items.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent-orange" />
                Requested Items / Equipment
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <thead className="bg-gray-200 text-gray-900 font-semibold">
                    <tr>
                      <th className="p-3">Item Name</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Price / Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {event.items.map((item, iIdx) => (
                      <tr key={iIdx}>
                        <td className="p-3 font-medium text-gray-900">{item.item_name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">₹{item.price_per_unit || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EventDetails;
