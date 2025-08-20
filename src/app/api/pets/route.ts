import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectToDB from '@/lib/mongodb';
import Pet from '@/models/Pets';

// GET - Fetch all pets for the logged-in user
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDB();

  const pets = await Pet.find({ userId }).lean(); // lean() converts to plain JS objects
  return NextResponse.json(pets);
}

// POST - Add a new pet
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, breed, age, photoUrl } = body;

    if (!name || !breed || age === undefined || age === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDB();

    const newPet = await Pet.create({
      userId,
      name,
      breed,
      age,
      photoUrl,
    });

    return NextResponse.json(newPet, { status: 201 });

  } catch (err: any) {
    console.error('POST /api/pets error:', err); // helpful for debugging in terminal
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}


// PATCH - Update an existing pet
export async function PATCH(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, name, breed, age, photoUrl } = body;

  if (!id) return NextResponse.json({ error: 'Missing pet id' }, { status: 400 });

  await connectToDB();

  const pet = await Pet.findOne({ _id: id, userId });
  if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

  if (name) pet.name = name;
  if (breed) pet.breed = breed;
  if (age !== undefined) pet.age = age;
  if (photoUrl !== undefined) pet.photoUrl = photoUrl;

  await pet.save();

  return NextResponse.json(pet.toObject());
}

// DELETE - Remove a pet
export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing pet id' }, { status: 400 });

  await connectToDB();

  const pet = await Pet.findOneAndDelete({ _id: id, userId });
  if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

  return NextResponse.json({ message: 'Pet deleted successfully' });
}
