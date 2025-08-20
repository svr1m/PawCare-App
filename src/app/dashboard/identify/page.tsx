'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { FaImage } from 'react-icons/fa';

export default function IdentifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [breed, setBreed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setBreed('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setError('');
    setBreed('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setBreed(data.breed);
    } catch (err: any) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] p-8 flex justify-center items-start">
      <SignedIn>
        <div className="max-w-lg w-full bg-white rounded shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FaImage className="text-[#E76F51] text-3xl" />
            <h1 className="text-3xl font-extrabold text-[#E76F51]">Breed Identification</h1>
          </div>
          <p className="mb-6 text-[#6D6875] text-base">
            Upload an image of your pet and let AI identify its breed!
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-6 block w-full text-sm text-[#264653] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F4A261] file:text-white hover:file:bg-[#e09a3f]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="w-full bg-[#F4A261] hover:bg-[#e09a3f] disabled:opacity-50 text-white font-semibold py-3 rounded transition"
          >
            {loading ? 'Identifying...' : 'Identify Breed'}
          </button>

          {breed && (
            <div className="mt-6 p-4 bg-[#E9F1F7] border-l-8 border-[#F4A261] rounded shadow text-[#264653] font-semibold">
              Predicted Breed: <span className="font-bold">{breed}</span>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-[#FFE3E3] border-l-8 border-[#E76F51] rounded shadow text-[#E76F51] font-semibold">
              Error: {error}
            </div>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <h2 className="text-black text-center mt-20 text-lg font-semibold">
          You must be signed in.
        </h2>
      </SignedOut>
    </div>
  );
}
