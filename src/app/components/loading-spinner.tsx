export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 opacity-50 fixed z-10">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}
