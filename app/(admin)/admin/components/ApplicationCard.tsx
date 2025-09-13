import { format } from 'date-fns'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'

import type { Application } from '../types'

interface ApplicationCardProps {
  application: Application
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void
  onDelete: (id: string) => void
}

export function ApplicationCard({ application, onUpdateStatus, onDelete }: ApplicationCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group hover:scale-[1.01] overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
              {application.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                {application.name}
              </CardTitle>
              <CardDescription className="text-gray-600 font-semibold truncate text-base">
                {application.email}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={application.status} />
            <Button 
              onClick={() => onDelete(application.id)} 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 font-semibold transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
            <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              University
            </h4>
            <p className="text-gray-900 font-semibold text-base">{application.university}</p>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
            <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Applied
            </h4>
            <p className="text-gray-900 font-semibold text-base">{format(new Date(application.created_at), 'PPP')}</p>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
            <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Major
            </h4>
            <p className="text-gray-900 font-semibold text-base">{application.major}</p>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
            <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Status
            </h4>
            <p className="text-gray-900 font-semibold text-base capitalize">{application.student_status.replace('-', ' ')}</p>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
            <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              Telegram
            </h4>
            <p className="text-gray-900 font-semibold text-base">{application.telegram_id}</p>
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-200/50">
          <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Why Join XueDAO
          </h4>
          <p className="text-gray-900 text-sm md:text-base leading-relaxed font-medium">
            {application.motivation}
          </p>
        </div>

        {/* Web3 Interests */}
        <div className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-200/50">
          <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Web3 Interests
          </h4>
          <p className="text-gray-900 text-sm md:text-base leading-relaxed font-medium">{application.web3_interests}</p>
        </div>

        {/* Skills Bringing */}
        <div className="bg-amber-50/30 p-5 rounded-xl border border-amber-200/50">
          <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Skills & Experience
          </h4>
          <p className="text-gray-900 text-sm md:text-base leading-relaxed font-medium">{application.skills_bringing}</p>
        </div>

        {/* Web3 Journey */}
        <div className="bg-violet-50/30 p-5 rounded-xl border border-violet-200/50">
          <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            Web3 Journey
          </h4>
          <p className="text-gray-900 text-sm md:text-base leading-relaxed font-medium">{application.web3_journey}</p>
        </div>

        {/* Contribution Areas and How Know Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-rose-50/30 p-5 rounded-xl border border-rose-200/50">
            <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              Contribution Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {application.contribution_areas.map((area, index) => (
                <span key={index} className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-medium">
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-teal-50/30 p-5 rounded-xl border border-teal-200/50">
            <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              How They Found Us
            </h4>
            <div className="flex flex-wrap gap-2">
              {application.how_know_us.map((source, index) => (
                <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {source.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {(application.referrer_name || application.last_words || application.years_since_graduation) && (
          <div className="space-y-4">
            {application.referrer_name && (
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  Referred By
                </h4>
                <p className="text-gray-900 font-semibold text-base">{application.referrer_name}</p>
              </div>
            )}
            {application.years_since_graduation && (
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  Years Since Graduation
                </h4>
                <p className="text-gray-900 font-semibold text-base">{application.years_since_graduation} years</p>
              </div>
            )}
            {application.last_words && (
              <div className="bg-pink-50/30 p-5 rounded-xl border border-pink-200/50">
                <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Additional Notes
                </h4>
                <p className="text-gray-900 text-sm md:text-base leading-relaxed font-medium italic">"{application.last_words}"</p>
              </div>
            )}
          </div>
        )}


        {application.status === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button 
              onClick={() => onUpdateStatus(application.id, 'approved')} 
              size="sm" 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md font-bold px-6 py-2.5 transition-all hover:scale-105"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Application
            </Button>
            <Button 
              onClick={() => onUpdateStatus(application.id, 'rejected')} 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 font-bold px-6 py-2.5 transition-all hover:scale-105 shadow-sm"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
          </div>
        )}

        {(application.reviewed_by && application.reviewed_at) && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 px-5 py-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-800 text-sm">Application Reviewed</p>
                <p className="text-green-700 text-xs font-medium mt-0.5">
                  Reviewed by <span className="font-bold">{application.reviewed_by}</span> on {format(new Date(application.reviewed_at), 'PPP')}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}