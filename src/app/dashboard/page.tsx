import { Card } from '@/components/ui/card'
import { Users, Briefcase, Building2, Map, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Workers"
          value="1,234"
          change="+10%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Active Jobs"
          value="567"
          change="+5%"
          trend="up"
          icon={Briefcase}
        />
        <StatsCard
          title="Total Cities"
          value="45"
          change="-2%"
          trend="down"
          icon={Map}
        />
        <StatsCard
          title="Categories"
          value="89"
          change="+12%"
          trend="up"
          icon={Building2}
        />
      </div>
    </div>
  )
}

function StatsCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon 
}: {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-3xl font-semibold mt-1">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="flex items-center gap-1">
        {trend === 'up' ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span className={cn(
          "text-sm",
          trend === 'up' ? "text-green-600" : "text-red-600"
        )}>
          {change}
        </span>
        <span className="text-sm text-gray-600 ml-1">from last month</span>
      </div>
    </Card>
  )
        }