import React from 'react';
import { SignedIn,SignedOut } from '@clerk/nextjs';
interface PetCardProps {
  name: string;
  breed: string;
  age: number;
  photoUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ name, breed, age, photoUrl, onEdit, onDelete }) => {
  return (
    <div className="bg-[#FFF8F1] shadow rounded p-4 max-w-xs border border-[#F4A261]"><SignedIn>
      <div className="h-40 w-full mb-4 overflow-hidden rounded">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${name} photo`}
            className="object-cover w-full h-full rounded"
          />
        ) : (
          <div className="flex items-center justify-center bg-[#2A9D8F] text-white h-full rounded">
            No Photo
          </div>
        )}
      </div>
      <h3 className="text-[#2A9D8F] text-lg font-semibold">{name}</h3>
      <p className="text-[#F4A261] italic">Breed: {breed}</p>
      <p className="text-gray-700">Age: {age} {age === 1 ? 'year' : 'years'}</p>
      <div className="mt-3 flex space-x-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-[#2A9D8F] hover:bg-[#21867a] text-white rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-[#E76F51] hover:bg-[#c1533d] text-white rounded"
          >
            Delete
          </button>
        )}
      </div></SignedIn><SignedOut><h2 className='text-black'>You must be signed in nigga.</h2></SignedOut>
    </div>
  );
};

export default PetCard;
