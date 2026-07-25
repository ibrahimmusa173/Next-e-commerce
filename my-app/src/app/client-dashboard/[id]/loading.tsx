export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Skeleton for back button */}
        <div className="h-4 w-32 bg-slate-800 animate-pulse rounded mb-6" />
        
        {/* Skeleton for Main Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 h-[500px] flex gap-10">
           <div className="w-1/2 bg-slate-800 animate-pulse rounded-[2rem]" />
           <div className="w-1/2 space-y-4 py-10">
              <div className="h-4 w-20 bg-slate-800 animate-pulse rounded" />
              <div className="h-10 w-full bg-slate-800 animate-pulse rounded" />
              <div className="h-6 w-1/4 bg-slate-800 animate-pulse rounded" />
              <div className="h-32 w-full bg-slate-800 animate-pulse rounded mt-10" />
           </div>
        </div>
      </div>
    </main>
  );
}