export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-md border border-ink/10 bg-white p-4">
            <div className="aspect-[4/3] rounded-md bg-mist" />
            <div className="mt-4 h-4 w-2/3 rounded bg-mist" />
            <div className="mt-3 h-4 w-1/2 rounded bg-mist" />
            <div className="mt-5 h-5 w-1/3 rounded bg-mist" />
          </div>
        ))}
      </div>
    </main>
  );
}
