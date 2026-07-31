export function Logout({ show, count }: { show: boolean; count: number }) {

    if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="rounded-lg text-center bg-white p-6 ">
        <p className="text-lg font-medium">
          Logging out in {count} seconds.
        </p>
      </div>
    </div>
  )
}