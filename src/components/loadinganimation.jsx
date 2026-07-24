export default function LoadingAnimation() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white shadow-lg border border-gray-200">
                <div className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <div className="text-lg font-semibold text-gray-800">Saving product...</div>
            </div>
        </div>
    );
}
