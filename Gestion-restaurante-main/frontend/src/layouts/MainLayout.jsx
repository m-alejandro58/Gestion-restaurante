import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fff7f2]">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

    </div>
  );
}

export default MainLayout;