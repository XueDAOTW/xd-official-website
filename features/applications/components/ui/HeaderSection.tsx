interface HeaderSectionProps {
  pageTitle: string
  welcomeMessage: string
  description: string
  notesTitle: string
  note1: string
  note2: string
  note3: string
}

export function HeaderSection({
  pageTitle,
  welcomeMessage,
  description,
  notesTitle,
  note1,
  note2,
  note3
}: HeaderSectionProps) {
  return (
    <>
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white/20">
        {pageTitle}
      </h1>

      {/* Welcome Content */}
      <div className="text-lg text-gray-100 max-w-4xl mx-auto space-y-6">
        <p className="font-semibold text-xl leading-relaxed">
          {welcomeMessage}
        </p>
        <p className="text-lg leading-relaxed text-gray-200">
          {description}
        </p>
        
        {/* Notes Section */}
        <div className="bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-lg rounded-3xl p-10 mt-10 shadow-xl border border-white/30">
          <h3 className="font-bold text-white/20 mb-6 text-xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 w-2 h-2 rounded-full"></span>
            {notesTitle}
          </h3>
          <div className="text-left bg-white rounded-xl p-6 hover:bg-gray-50 transition-all duration-300">
            <div className="text-gray-800 space-y-4">
              <div className="flex items-start">
                <span className="text-2xl">✏️</span> 
                <span className="text-base leading-relaxed">{note1}</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl">📌</span> 
                <span className="text-base leading-relaxed">{note2}</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl">🎯</span> 
                <span className="text-base leading-relaxed">{note3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}