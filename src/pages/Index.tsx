
import HabitTracker from "@/components/HabitTracker";
import ProtectedRoute from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
        <HabitTracker />
      </div>
    </ProtectedRoute>
  );
};

export default Index;
