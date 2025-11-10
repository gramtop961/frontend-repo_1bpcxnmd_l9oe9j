import { ArrowUp, MessageSquare, Link as LinkIcon } from 'lucide-react'

export default function IdeaCard({ idea, onVote, onOpen }) {
  return (
    <div className="group bg-white/70 backdrop-blur rounded-xl border border-white/60 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-4 md:p-5 flex gap-4">
        <button
          onClick={() => onVote(idea.id)}
          className="flex flex-col items-center justify-center w-14 shrink-0 rounded-lg border bg-white hover:bg-violet-50 hover:border-violet-200 transition"
          title="Upvote"
        >
          <ArrowUp className="h-5 w-5 text-violet-600" />
          <span className="text-xs font-semibold text-violet-700">{idea.votes_count}</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{idea.title}</h3>
            {idea.link && (
              <a
                href={idea.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-violet-700 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkIcon className="h-4 w-4" /> link
              </a>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{idea.description}</p>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <div className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {idea.comments_count}</div>
            <div className="hidden md:block">{new Date(idea.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <button onClick={() => onOpen(idea.id)} className="w-full text-left px-5 py-3 bg-gradient-to-r from-violet-50 to-blue-50 text-sm text-violet-700 hover:from-violet-100 hover:to-blue-100">
        View details & comments
      </button>
    </div>
  )
}
