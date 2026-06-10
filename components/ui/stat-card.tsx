type StatCardProps = {
  title: string
  value: number | string
  icon: React.ReactNode
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400 mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="text-zinc-600">{icon}</div>
      </div>
    </div>
  )
}