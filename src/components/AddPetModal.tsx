'use client'

import React, { useState } from 'react';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: { name: string; breed: string; age: number; photoUrl?: string }) => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onAddPet }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [useImageForBreed, setUseImageForBreed] = useState(false);
  const [breedImageFile, setBreedImageFile] = useState<File | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert File to Base64 string to store as photoUrl
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Call your breed identification API
  const identifyBreedFromImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/identify', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Breed identification failed');
    }

    const data = await res.json();
    if (!data.breed) {
      throw new Error('No breed returned from API');
    }
    return data.breed;
  };

  const handleBreedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setBreedImageFile(null);
      setBreed('');
      setPhotoUrl('');
      return;
    }

    const file = e.target.files[0];
    setBreedImageFile(file);
    setIdentifying(true);
    setError(null);

    try {
      const identifiedBreed = await identifyBreedFromImage(file);
      setBreed(identifiedBreed);

      // Convert image file to Base64 and set as photoUrl
      const base64Image = await fileToBase64(file);
      setPhotoUrl(base64Image);
    } catch (err: any) {
      setError(err.message || 'Failed to identify breed. Please try again.');
      setBreed('');
      setPhotoUrl('');
    } finally {
      setIdentifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !breed.trim() || age === '' || age < 0) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    onAddPet({ name: name.trim(), breed: breed.trim(), age: Number(age), photoUrl: photoUrl || undefined });

    // Reset form
    setName('');
    setBreed('');
    setAge('');
    setPhotoUrl('');
    setUseImageForBreed(false);
    setBreedImageFile(null);
    setError(null);

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
        <h2 className="text-xl font-extrabold mb-4">Add New Pet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
              style={{ border: '1px solid #264653', color: '#264653', backgroundColor: '#FFF8F1' }}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Breed *</label>
            <div className="mb-2 flex items-center space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={!useImageForBreed}
                  onChange={() => {
                    setUseImageForBreed(false);
                    setBreedImageFile(null);
                    setError(null);
                    setBreed('');
                    setPhotoUrl('');
                  }}
                  className="mr-2"
                />
                Enter breed manually
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={useImageForBreed}
                  onChange={() => {
                    setUseImageForBreed(true);
                    setBreed('');
                    setError(null);
                    setPhotoUrl('');
                  }}
                  className="mr-2"
                />
                Identify breed by image
              </label>
            </div>

            {!useImageForBreed ? (
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                style={{ border: '1px solid #264653', color: '#264653', backgroundColor: '#FFF8F1' }}
                required
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBreedImageChange}
                  className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                  style={{ border: '1px solid #264653', backgroundColor: '#FFF8F1' }}
                  required
                  disabled={identifying}
                />
                {identifying && <p className="text-[#2a9d8f] mt-2">Identifying breed...</p>}
                {error && <p className="text-[#E76F51] mt-2">{error}</p>}
                {breed && !identifying && !error && (
                  <p className="mt-2 text-[#264653] font-semibold">Identified breed: {breed}</p>
                )}
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt="Identified breed image"
                    className="mt-2 max-h-40 w-auto rounded border border-[#264653]"
                  />
                )}
              </>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Age (years) *</label>
            <input
              type="number"
              min="0"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
              style={{ border: '1px solid #264653', color: '#264653', backgroundColor: '#FFF8F1' }}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Photo URL (optional)</label>
            {!useImageForBreed && (
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                style={{ border: '1px solid #264653', color: '#264653', backgroundColor: '#FFF8F1' }}
              />
            )}
            {photoUrl && !useImageForBreed && (
              <img
                src={photoUrl}
                alt="Pet preview"
                className="mt-2 max-h-40 w-auto rounded border border-[#264653]"
              />
            )}
          </div>

          {error && <p className="text-[#E76F51] font-semibold">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#264653] hover:bg-[#E9F1F7] text-[#264653]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={identifying}
              className="px-4 py-2 rounded bg-[#2a9d8f] text-white hover:bg-[#1f746f] disabled:opacity-50"
            >
              Add Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;
