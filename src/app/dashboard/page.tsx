'use client'
import { useEffect, useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import DashboardCard from '@/components/DashboardCard'
import { FaPaw, FaComments, FaImage, FaLightbulb, FaBell } from 'react-icons/fa'
import { SignedIn,SignedOut } from '@clerk/nextjs'

export default function Dashboard() {
  const { user } = useUser()

  const [tips, setTips] = useState<string[]>([])
  const [loadingTips, setLoadingTips] = useState(true)

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([])

  // Fetch pet care tips
useEffect(() => {
  const fetchTips = async () => {
    try {
      const cachedTips = sessionStorage.getItem('petCareTips');
      if (cachedTips) {
        setTips(JSON.parse(cachedTips));
        setLoadingTips(false);
        return;
      }

      const res = await fetch('/api/tips');
      const data = await res.json();
      const tipsData = data.tips || [];

      setTips(tipsData);
      sessionStorage.setItem('petCareTips', JSON.stringify(tipsData));
    } catch (err) {
      console.error('Failed to fetch tips:', err);
      setTips([
        "Unable to load personalized tips. Please check back later.",
      ]);
    } finally {
      setLoadingTips(false);
    }
  };

  fetchTips();
}, []);


  // Fetch FAQs
 useEffect(() => {
  const fetchFaqs = async () => {
    try {
      const cachedFaqs = sessionStorage.getItem('breedFaqs');
      if (cachedFaqs) {
        setFaqs(JSON.parse(cachedFaqs));
        return;
      }

      const res = await fetch('/api/faqs');
      const data = await res.json();
      const faqsData = data.faqs || [];

      setFaqs(faqsData);
      sessionStorage.setItem('breedFaqs', JSON.stringify(faqsData));
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    }
  };

  fetchFaqs();
}, []);


 

  return (
    <div className="min-h-screen bg-[#FFF8F1] p-8"><SignedIn>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-[#F4A261]">
              🐾 Welcome, {user?.firstName || user?.fullName}!
            </h1>
            <p className="text-[#6D6875] mt-1">
              Glad to have you back. Let’s take care of your furry friends!
            </p>
          </div>
          <UserButton />
        </div>

        {/* Tips Bar */}
        <div className="bg-[#E9F1F7] border-l-8 border-[#F4A261] p-4 mb-6 rounded shadow-sm flex items-start gap-3">
          <FaLightbulb className="text-[#F4A261] text-2xl flex-shrink-0 mt-1" />
          <div className="text-[#264653] font-medium">
            <p className="mb-1">Pet Care Tips:</p>
            {loadingTips ? (
              <p className="text-sm text-[#264653]">Loading tips...</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-[#264653]">
                {tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-[#FFF4E6] border-l-8 border-[#E76F51] p-4 mb-10 rounded shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FaBell className="text-[#E76F51] text-2xl" />
            <h2 className="text-[#E76F51] font-semibold text-lg">Breed-Based FAQs</h2>
          </div>
          {faqs.length === 0 ? (
            <p className="text-[#6D6875] text-sm">Loading FAQs for your pet's breed...</p>
          ) : (
            <ul className="space-y-2 text-sm text-[#264653]">
              {faqs.map((faq, i) => (
                <li key={i}>
                  <strong className="block">{faq.question}</strong>
                  <span>{faq.answer}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Pet Profiles"
            description="Manage your pets' profiles."
            icon={<FaPaw className="text-[#F4A261] text-2xl" />}
            href="/dashboard/pets"
          />
          <DashboardCard
            title="Chatbot"
            description="Get AI guidance and support."
            icon={<FaComments className="text-[#2a9d8f] text-2xl" />}
            href="/dashboard/chatbot"
          />
          <DashboardCard
            title="Breed Identification"
            description="Upload pet images to identify breeds."
            icon={<FaImage className="text-[#E76F51] text-2xl" />}
            href="/dashboard/identify"
          />
        </div>
      </div></SignedIn><SignedOut><h2 className='text-black'>You must be signed in nigga.</h2></SignedOut>
    </div>
  )
}