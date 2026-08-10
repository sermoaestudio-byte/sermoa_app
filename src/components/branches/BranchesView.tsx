import React, { useState } from 'react';
import { MapPin, Building2, Plus, Users, Compass, Clock, Navigation } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Branch } from '../../types';

export const BranchesView: React.FC = () => {
  const { branches, studio } = useStudioStore();

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Operativa Diaria</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sucursales & Salas Físicas
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configura tus ubicaciones físicas, salas de equipamiento y coordenadas GPS para check-in
            </p>
          </div>
        </div>

        {/* Branches Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Name */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{branch.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{branch.address}, {branch.city}</p>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">
                    Operativa
                  </span>
                </div>

                {/* Operating hours */}
                <div className="bg-slate-50 rounded-2xl p-3.5 mb-4 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{branch.opening_hours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-3.5 h-3.5 text-slate-400" />
                    <span>Teléfono: {branch.phone}</span>
                  </div>
                </div>

                {/* Rooms List */}
                <div className="mb-4">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-tight mb-2">
                    Salas & Capacidad
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {branch.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800">{room.name}</span>
                        <span className="text-[11px] font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                          {room.capacity} alumnos
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GPS Coordinates Badge */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-950">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold block">Geolocalización GPS Activa</span>
                      <span className="text-[11px] text-emerald-700">
                        Lat: {branch.latitude.toFixed(4)}, Lon: {branch.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <span className="bg-white text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                    Radio: {studio.gps_checkin_radius_meters}m
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
