export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-paper-2" />
      <div className="mt-6 h-40 animate-pulse rounded-3xl bg-paper-2" />
    </div>
  );
}
