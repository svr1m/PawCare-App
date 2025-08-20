'use client';

import React, { useState, useEffect } from 'react';
import PetsGrid from '@/components/PetsGrid';
import AddPetModal from '@/components/AddPetModal';
import EditPetModal from '@/components/EditPetModal';
import { SignedIn } from '@clerk/nextjs';
import { SignedOut } from '@clerk/nextjs';
interface Pet {
  _id: string;
  name: string;
  breed: string;
  age: number;
  photoUrl?: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch pets on mount
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets');
        const data = await res.json();
        setPets(data);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };

    fetchPets();
  }, []);

  // Add a pet via API
  const handleAddPet = async (newPet: Omit<Pet, '_id'>) => {
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to add pet';
        try {
          const errorData = await res.json();
          console.error('API error response:', errorData);
          errorMessage = errorData?.error || errorMessage;
        } catch (jsonErr) {
          console.error('Failed to parse error response:', jsonErr);
        }
        throw new Error(errorMessage);
      }

      const addedPet = await res.json();
      setPets((prev) => [...prev, addedPet]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error in handleAddPet:', error);
      alert(`Error adding pet: ${(error as Error).message}`);
    }
  };

  // Open edit modal for a pet
  const handleEditPet = (id: string) => {
    const petToEdit = pets.find((pet) => pet._id === id);
    if (petToEdit) {
      setEditingPet(petToEdit);
      setIsEditModalOpen(true);
    }
  };

  // Update a pet via API (send `id`, not `_id`)
  const handleUpdatePet = async (updatedPet: { id: string; name: string; breed: string; age: number }) => {
    try {
      const res = await fetch('/api/pets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPet), // send id, not _id
      });

      if (!res.ok) {
        let errorMessage = 'Failed to update pet';
        try {
          const errorData = await res.json();
          console.error('Update API error response:', errorData);
          errorMessage = errorData?.error || errorMessage;
        } catch (jsonErr) {
          console.error('Failed to parse update error response:', jsonErr);
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      setPets((prev) => prev.map((pet) => (pet._id === data._id ? data : pet)));
      setEditingPet(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating pet:', error);
      alert(`Error updating pet: ${(error as Error).message}`);
    }
  };

  // Delete a pet via API
  const handleDeletePet = async (id: string) => {
  if (!confirm('Are you sure you want to delete this pet?')) return;

  try {
    const res = await fetch(`/api/pets?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',  // THIS IS CRUCIAL to send cookies for auth
    });

    if (!res.ok) {
      let errorMessage = 'Failed to delete pet';
      try {
        const errorData = await res.json();
        console.error('Delete API error response:', errorData);
        errorMessage = errorData?.error || errorMessage;
      } catch (jsonErr) {
        console.error('Failed to parse delete error response:', jsonErr);
      }
      throw new Error(errorMessage);
    }

    setPets((prev) => prev.filter((pet) => pet._id !== id));
  } catch (error) {
    console.error('Error deleting pet:', error);
    alert(`Error deleting pet: ${(error as Error).message}`);
  }
  };


 return (
  <div className="p-6 bg-[#FFF8F1] min-h-screen w-full">
   <SignedIn>
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-[#F4A261]">Your Pets</h1>
    <button
      onClick={() => setIsAddModalOpen(true)}
      className="bg-[#2A9D8F] text-white px-4 py-2 rounded hover:bg-[#21867a]"
    >
      + Add Pet
    </button>
  </div>

  {Array.isArray(pets) && pets.length === 0 ? (
    <p className="text-gray-600">You haven't added any pets yet.</p>
  ) : (
    Array.isArray(pets) && (
      <PetsGrid
        pets={pets.map((pet) => ({
          ...pet,
          id: pet._id,
        }))}
        onEdit={handleEditPet}
        onDelete={handleDeletePet}
      />
    )
  )}

  <AddPetModal
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
    onAddPet={handleAddPet}
  />

  {editingPet && (
    <EditPetModal
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false);
        setEditingPet(null);
      }}
      pet={{
        id: editingPet._id,
        name: editingPet.name,
        breed: editingPet.breed,
        age: editingPet.age,
      }}
      onUpdatePet={handleUpdatePet}
    />
  )}
</SignedIn>


    <SignedOut>
      <h2 className="text-black">You must be signed in nigga.</h2>
    </SignedOut>
  </div>
);

}
