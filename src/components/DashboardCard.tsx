interface DashboardCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

export default function DashboardCard({ title, description, icon, href }: DashboardCardProps) {
  return (
    <a
      href={href}
      className="block p-6 border border-[#EADBC8] bg-white rounded-xl hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-[#264653]">{title}</h2>
      <p className="text-[#6D6875]">{description}</p>
    </a>
  )
}
