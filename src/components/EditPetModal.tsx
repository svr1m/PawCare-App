'use client';

import React, { useState, useEffect } from 'react';

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePet: (updatedPet: { id: string; name: string; breed: string; age: number }) => void;
  pet: { id: string; name: string; breed: string; age: number };
}

export default function EditPetModal({ isOpen, onClose, onUpdatePet, pet }: EditPetModalProps) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number>(0);

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setBreed(pet.breed);
      setAge(pet.age);
    }
  }, [pet]);

  const handleSubmit = () => {
    if (!name.trim() || !breed.trim() || age < 0) return;
    onUpdatePet({ id: pet.id, name: name.trim(), breed: breed.trim(), age });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(255, 248, 241, 0.9)' }}
    >
      <div
        className="rounded p-6 max-w-md w-full shadow-lg"
        style={{
          backgroundColor: '#F4A261',
          color: '#264653',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <h2 className="text-xl font-extrabold mb-4">Edit Pet</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
              style={{ border: '1px solid #264653', backgroundColor: '#FFF8F1', color: '#264653' }}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Breed *</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
              style={{ border: '1px solid #264653', backgroundColor: '#FFF8F1', color: '#264653' }}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Age (years) *</label>
            <input
              type="number"
              min="0"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
              style={{ border: '1px solid #264653', backgroundColor: '#FFF8F1', color: '#264653' }}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#264653] hover:bg-[#E9F1F7] text-[#264653]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#2a9d8f] text-white hover:bg-[#1f746f]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
