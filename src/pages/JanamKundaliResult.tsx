
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JanamKundaliResult as JanamKundaliResultComponent } from '@/components/JanamKundaliResult';

const JanamKundaliResult = () => {
  return (
    <div className="min-h-screen bg-cosmic-midnight text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <JanamKundaliResultComponent />
      </main>
      <Footer />
    </div>
  );
};

export default JanamKundaliResult;
