import Skeleton from "../ui/Skeleton";

function BoardSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48" />

      <Skeleton className="mt-2 h-4 w-72" />

      <div className="mt-6 flex gap-4 overflow-hidden">
        {Array.from({
          length: 4,
        }).map((_, columnIndex) => (
          <div
            key={columnIndex}
            className="min-w-[290px] flex-1 rounded-xl bg-gray-100 p-4"
          >
            <Skeleton className="mb-4 h-5 w-28" />

            <div className="space-y-3">
              {Array.from({
                length: 3,
              }).map((_, taskIndex) => (
                <div key={taskIndex} className="rounded-xl bg-white p-4">
                  <Skeleton className="h-4 w-3/4" />

                  <Skeleton className="mt-3 h-3 w-full" />

                  <Skeleton className="mt-2 h-3 w-2/3" />

                  <div className="mt-4 flex justify-between">
                    <Skeleton className="h-7 w-24" />

                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardSkeleton;
